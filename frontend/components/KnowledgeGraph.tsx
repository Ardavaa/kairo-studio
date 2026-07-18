"use client";

import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { X, Loader2 } from "lucide-react";
// Since ForceGraph2D requires `window`, we import it dynamically, disabling SSR
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
  loading: () => <p className="text-muted text-sm">Loading visualizer...</p>,
});

interface Node {
  id: string; 
  name: string;
  node_type: string;
}

interface Edge {
  source: string; 
  target: string; 
  relation_type: string;
}

interface GraphData {
  nodes: Node[];
  links: Edge[];
}

interface KnowledgeGraphProps {
  onClose: () => void;
}

export default function KnowledgeGraph({ onClose }: KnowledgeGraphProps) {
  const [data, setData] = useState<GraphData>({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  
  // We can't type fgRef perfectly since we dynamic-imported it, so we use any
  const fgRef = useRef<any>();

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const [nodesRes, edgesRes] = await Promise.all([
          fetch("http://localhost:8000/api/v1/graph/nodes"),
          fetch("http://localhost:8000/api/v1/graph/edges")
        ]);
        
        const nodesData = await nodesRes.json();
        const edgesData = await edgesRes.json();
        
        const formattedNodes = nodesData.map((n: any) => ({
          id: n.id,
          name: n.name,
          node_type: n.node_type
        }));
        
        const formattedLinks = edgesData.map((e: any) => ({
          source: e.source_id,
          target: e.target_id,
          relation_type: e.relation_type,
          name: e.relation_type
        }));
        
        setData({ nodes: formattedNodes, links: formattedLinks });
      } catch (e) {
        console.error("Failed to fetch graph data", e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGraph();
  }, []);

  const getNodeColor = (type: string) => {
    switch(type) {
      case 'Method': return '#FC2BA3'; // Pink
      case 'Dataset': return '#144EC5'; // Blue
      case 'Task': return '#F9C83D'; // Yellow
      case 'Metric': return '#FC6D35'; // Orange
      default: return '#C2D6E1'; // Gray-blue
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-6xl h-[85vh] bg-paper-white rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-soft-border">
        
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-soft-border bg-white z-10 shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-primary">Knowledge Graph</h2>
            <p className="text-sm text-muted">Visualizing extracted entities and relationships</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-black/5 rounded-full transition-colors text-muted hover:text-primary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 w-full bg-warm-white relative overflow-hidden">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-accent" />
              <p>Fetching entities from database...</p>
            </div>
          ) : data.nodes.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted">
              <p>No graph data found in the database yet.</p>
              <p className="text-sm">Try running a search query first!</p>
            </div>
          ) : (
            <ForceGraph2D
              ref={fgRef}
              graphData={data}
              nodeLabel="name"
              nodeColor={(node: any) => getNodeColor(node.node_type)}
              nodeRelSize={6}
              linkColor={() => 'rgba(0,0,0,0.2)'}
              linkDirectionalParticles={2}
              linkDirectionalParticleSpeed={0.005}
              onNodeClick={(node: any) => {
                fgRef.current?.centerAt(node.x, node.y, 1000);
                fgRef.current?.zoom(4, 2000);
              }}
              nodeCanvasObject={(node: any, ctx: any, globalScale: number) => {
                const label = node.name;
                const fontSize = 12 / globalScale;
                ctx.font = `${fontSize}px Sans-Serif`;
                const textWidth = ctx.measureText(label).width;
                const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); 

                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1]);

                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = getNodeColor(node.node_type);
                ctx.fillText(label, node.x, node.y);
              }}
              linkCanvasObjectMode={() => "after"}
              linkCanvasObject={(link: any, ctx: any, globalScale: number) => {
                 const MAX_FONT_SIZE = 4;
                 const LABEL_NODE_MARGIN = 6;
                 
                 const start = link.source;
                 const end = link.target;
                 
                 // Ignore unbound links
                 if (typeof start !== 'object' || typeof end !== 'object') return;
                 
                 const textPos = Object.assign({}, start);
                 const relLink = { x: end.x - start.x, y: end.y - start.y };
                 
                 const maxTextLength = Math.sqrt(Math.pow(relLink.x, 2) + Math.pow(relLink.y, 2)) - LABEL_NODE_MARGIN * 2;
                 
                 let textAngle = Math.atan2(relLink.y, relLink.x);
                 // maintain label vertical orientation
                 if (textAngle > Math.PI / 2) textAngle = -(Math.PI - textAngle);
                 if (textAngle < -Math.PI / 2) textAngle = -(-Math.PI - textAngle);
                 
                 const label = link.relation_type;
                 const fontSize = Math.min(MAX_FONT_SIZE, maxTextLength / ctx.measureText(label).width);
                 
                 ctx.font = `${fontSize}px Sans-Serif`;
                 ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
                 
                 // Center the text
                 Object.assign(textPos, {
                   x: start.x + relLink.x / 2,
                   y: start.y + relLink.y / 2
                 });
                 
                 ctx.save();
                 ctx.translate(textPos.x, textPos.y);
                 ctx.rotate(textAngle);
                 
                 ctx.textAlign = 'center';
                 ctx.textBaseline = 'middle';
                 ctx.fillText(label, 0, 0);
                 ctx.restore();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
