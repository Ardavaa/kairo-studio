"""
Authentication API endpoints for Kairo Studio.
Handles Google OAuth and JWT authentication.
"""
from fastapi import APIRouter, HTTPException, Response, Request
from fastapi.responses import RedirectResponse, JSONResponse
from pydantic import BaseModel
from typing import Optional
import logging

from app.core.auth import (
    settings,
    create_access_token,
    verify_token,
    get_google_oauth_url,
    exchange_code_for_tokens,
    get_google_user_info,
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/auth", tags=["authentication"])


class TokenResponse(BaseModel):
    """Response model for successful authentication."""
    access_token: str
    token_type: str = "bearer"
    user: dict


class UserInfo(BaseModel):
    """User information model."""
    id: str
    email: str
    name: str
    picture: Optional[str] = None


@router.get("/google")
async def google_auth():
    """
    Redirect user to Google OAuth consent screen.
    """
    # Check if Google OAuth is configured
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=503,
            detail="Google OAuth is not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file."
        )
    
    oauth_url = get_google_oauth_url()
    return RedirectResponse(url=oauth_url)


@router.get("/callback/google")
async def google_callback(code: str, state: Optional[str] = None):
    """
    Handle Google OAuth callback.
    Exchanges the authorization code for tokens and returns a JWT.
    """
    # Exchange code for tokens
    tokens = await exchange_code_for_tokens(code)
    
    if not tokens:
        raise HTTPException(
            status_code=400,
            detail="Failed to exchange authorization code for tokens"
        )
    
    # Get user info from Google
    access_token = tokens.get("access_token")
    if not access_token:
        raise HTTPException(
            status_code=400,
            detail="No access token received from Google"
        )
    
    user_info = await get_google_user_info(access_token)
    
    if not user_info:
        raise HTTPException(
            status_code=400,
            detail="Failed to get user information from Google"
        )
    
    # Create our own JWT token
    jwt_token = create_access_token(
        data={
            "sub": user_info.get("id"),
            "email": user_info.get("email"),
            "name": user_info.get("name"),
            "picture": user_info.get("picture"),
        }
    )
    
    # Redirect to frontend with token
    # In production, you might want to set the token as an HTTP-only cookie
    # For now, we redirect with the token as a query parameter
    frontend_url = f"{settings.FRONTEND_URL}/auth/success"
    
    response = RedirectResponse(
        url=f"{frontend_url}?token={jwt_token}",
        status_code=302
    )
    
    # Also set the token as an HTTP-only cookie for security
    response.set_cookie(
        key="auth_token",
        value=jwt_token,
        httponly=True,
        secure=True,  # Set to True in production with HTTPS
        samesite="lax",
        max_age=60 * 60 * 24 * 7,  # 7 days
    )
    
    return response


@router.get("/me")
async def get_current_user(request: Request):
    """
    Get the current authenticated user's information.
    """
    # Try to get token from cookie first
    token = request.cookies.get("auth_token")
    
    # If no cookie, try Authorization header
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
    
    if not token:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated. Please sign in."
        )
    
    payload = verify_token(token)
    
    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token. Please sign in again."
        )
    
    return {
        "id": payload.get("sub"),
        "email": payload.get("email"),
        "name": payload.get("name"),
        "picture": payload.get("picture"),
    }


@router.post("/logout")
async def logout(request: Request):
    """
    Log out the current user.
    """
    response = JSONResponse(content={"message": "Successfully logged out"})
    
    # Clear the auth cookie
    response.delete_cookie(key="auth_token")
    
    return response


@router.get("/status")
async def auth_status(request: Request):
    """
    Check if the current user is authenticated.
    """
    token = request.cookies.get("auth_token")
    
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
    
    if token:
        payload = verify_token(token)
        if payload:
            return {
                "authenticated": True,
                "user": {
                    "id": payload.get("sub"),
                    "email": payload.get("email"),
                    "name": payload.get("name"),
                    "picture": payload.get("picture"),
                }
            }
    
    return {"authenticated": False}


@router.post("/refresh")
async def refresh_token(request: Request):
    """
    Refresh the access token if still valid.
    """
    token = request.cookies.get("auth_token")
    
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
    
    if not token:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated"
        )
    
    payload = verify_token(token)
    
    if not payload:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )
    
    # Create new token with same data
    new_token = create_access_token(
        data={
            "sub": payload.get("sub"),
            "email": payload.get("email"),
            "name": payload.get("name"),
            "picture": payload.get("picture"),
        }
    )
    
    response = JSONResponse(content={"message": "Token refreshed"})
    
    # Update the cookie with new token
    response.set_cookie(
        key="auth_token",
        value=new_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=60 * 60 * 24 * 7,
    )
    
    return response
