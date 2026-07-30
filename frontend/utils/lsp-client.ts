export class TypstLspClient {
  private ws: WebSocket | null = null;
  private messageId = 1;
  private pendingRequests: Map<number, { resolve: (val: any) => void, reject: (err: any) => void }> = new Map();
  private editor: any;
  private monaco: any;
  private fileUri: string;
  private rootUri: string;
  private documentVersion = 1;
  public onDiagnostics?: (diagnostics: any[]) => void;

  constructor(private url: string, editor: any, monaco: any, fileUri: string, rootUri: string) {
    this.editor = editor;
    this.monaco = monaco;
    this.fileUri = fileUri;
    this.rootUri = rootUri;
  }

  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.url);
      
      this.ws.onopen = async () => {
        try {
          await this.initialize();
          await this.initialized();
          await this.didOpen();
          resolve();
        } catch (e) {
          reject(e);
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.id !== undefined && this.pendingRequests.has(message.id)) {
            if (message.error) {
              this.pendingRequests.get(message.id)!.reject(message.error);
            } else {
              this.pendingRequests.get(message.id)!.resolve(message.result);
            }
            this.pendingRequests.delete(message.id);
          } else if (message.method === "textDocument/publishDiagnostics") {
            if (this.onDiagnostics) {
              this.onDiagnostics(message.params.diagnostics);
            }
          }
        } catch (e) {
          console.error("Failed to parse LSP message", e);
        }
      };

      this.ws.onerror = (e) => {
        console.warn("LSP WebSocket not connected or unavailable");
      };

      this.ws.onclose = () => {
        console.log("LSP WebSocket closed");
      };
    });
  }

  private sendRequest(method: string, params: any): Promise<any> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return Promise.reject(new Error("WebSocket not connected"));
    }
    return new Promise((resolve, reject) => {
      const id = this.messageId++;
      this.pendingRequests.set(id, { resolve, reject });
      this.ws!.send(JSON.stringify({
        jsonrpc: "2.0",
        id,
        method,
        params
      }));
    });
  }

  private sendNotification(method: string, params: any) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.ws.send(JSON.stringify({
      jsonrpc: "2.0",
      method,
      params
    }));
  }

  private async initialize() {
    return this.sendRequest("initialize", {
      processId: null,
      rootUri: this.rootUri,
      workspaceFolders: [{
        uri: this.rootUri,
        name: "workspace"
      }],
      capabilities: {
        textDocument: {
          completion: {
            completionItem: {
              snippetSupport: true,
              resolveSupport: {
                properties: ["documentation", "detail", "additionalTextEdits"]
              }
            }
          },
          hover: {
            contentFormat: ["markdown", "plaintext"]
          }
        }
      }
    });
  }

  private initialized() {
    this.sendNotification("initialized", {});
  }

  private didOpen() {
    this.sendNotification("textDocument/didOpen", {
      textDocument: {
        uri: this.fileUri,
        languageId: "typst",
        version: 1,
        text: this.initialText
      }
    });
  }

  public isConnected(): boolean {
    return !!this.ws && this.ws.readyState === WebSocket.OPEN;
  }

  public didChange() {
    if (!this.isConnected() || !this.editor) return;
    this.sendNotification("textDocument/didChange", {
      textDocument: {
        uri: this.fileUri,
        version: 2
      },
      contentChanges: [
        {
          text: this.editor.getValue()
        }
      ]
    });
  }

  public openFile(fileUri: string, text: string) {
    this.fileUri = fileUri;
    this.initialText = text;
    if (this.isConnected()) {
      this.didOpen();
    }
  }

  public async getCompletion(position: any, context?: any) {
    if (!this.isConnected()) return null;
    const params: any = {
      textDocument: { uri: this.fileUri },
      position: {
        line: position.lineNumber - 1,
        character: position.column - 1
      }
    };
    if (context) {
      params.context = {
        // Monaco triggerKind is 0-indexed (0=Invoke, 1=TriggerCharacter), LSP is 1-indexed (1=Invoked, 2=TriggerCharacter)
        triggerKind: (context.triggerKind || 0) + 1,
        triggerCharacter: context.triggerCharacter
      };
    }
    return await this.sendRequest("textDocument/completion", params).catch(() => null);
  }

  public async getHover(position: any) {
    if (!this.isConnected()) return null;
    return await this.sendRequest("textDocument/hover", {
      textDocument: { uri: this.fileUri },
      position: {
        line: position.lineNumber - 1,
        character: position.column - 1
      }
    }).catch(() => null);
  }

  public dispose() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

