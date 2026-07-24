export class TypstLspClient {
  private ws: WebSocket | null = null;
  private messageId = 1;
  private pendingRequests: Map<number, { resolve: (val: any) => void, reject: (err: any) => void }> = new Map();
  private editor: any;
  private monaco: any;
  private fileUri: string;
  private documentVersion = 1;
  public onDiagnostics?: (diagnostics: any[]) => void;

  constructor(private url: string, editor: any, monaco: any, fileUri: string) {
    this.editor = editor;
    this.monaco = monaco;
    this.fileUri = fileUri;
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
        console.error("LSP WebSocket error", e);
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
      rootUri: null, // "file:///workspace" usually, we can keep it simple
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
        version: this.documentVersion,
        text: this.editor.getValue()
      }
    });
  }

  public didChange() {
    this.documentVersion++;
    this.sendNotification("textDocument/didChange", {
      textDocument: {
        uri: this.fileUri,
        version: this.documentVersion
      },
      contentChanges: [{
        text: this.editor.getValue()
      }]
    });
  }

  public async getCompletions(position: any) {
    const response = await this.sendRequest("textDocument/completion", {
      textDocument: { uri: this.fileUri },
      position: {
        line: position.lineNumber - 1,
        character: position.column - 1
      }
    });
    return response;
  }

  public async getHover(position: any) {
    const response = await this.sendRequest("textDocument/hover", {
      textDocument: { uri: this.fileUri },
      position: {
        line: position.lineNumber - 1,
        character: position.column - 1
      }
    });
    return response;
  }

  public dispose() {
    if (this.ws) {
      this.ws.close();
    }
  }
}
