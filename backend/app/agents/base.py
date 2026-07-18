from typing import Any
from abc import ABC, abstractmethod

class BaseAgent(ABC):
    @abstractmethod
    async def run(self, *args, **kwargs) -> Any:
        pass
