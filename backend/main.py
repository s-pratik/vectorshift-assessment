# main.py
# Part 4: /pipelines/parse — counts nodes/edges and checks if the graph is a DAG

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, List

app = FastAPI()

# Allow requests from the React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Pydantic models ────────────────────────────────────────────────────────────

class Node(BaseModel):
    id: str
    type: str | None = None
    data: dict[str, Any] | None = None
    position: dict[str, Any] | None = None


class Edge(BaseModel):
    id: str
    source: str
    target: str
    sourceHandle: str | None = None
    targetHandle: str | None = None


class Pipeline(BaseModel):
    nodes: List[Node]
    edges: List[Edge]


# ── DAG check via DFS ──────────────────────────────────────────────────────────

def is_dag(nodes: List[Node], edges: List[Edge]) -> bool:
    """
    Returns True if the directed graph formed by nodes/edges is a DAG
    (i.e., contains no directed cycles), using iterative DFS with colouring.
    """
    # Build adjacency list
    adj: dict[str, list[str]] = {node.id: [] for node in nodes}
    for edge in edges:
        if edge.source in adj:
            adj[edge.source].append(edge.target)

    # 0 = unvisited, 1 = in current DFS stack, 2 = fully processed
    color: dict[str, int] = {node.id: 0 for node in nodes}

    for start in adj:
        if color[start] != 0:
            continue

        # Iterative DFS using an explicit stack of (node, iterator_over_neighbours)
        stack = [(start, iter(adj[start]))]
        color[start] = 1

        while stack:
            node, neighbours = stack[-1]
            try:
                nxt = next(neighbours)
                if color.get(nxt, 2) == 1:
                    # Back edge found → cycle
                    return False
                if color.get(nxt, 2) == 0:
                    color[nxt] = 1
                    stack.append((nxt, iter(adj.get(nxt, []))))
            except StopIteration:
                color[node] = 2
                stack.pop()

    return True


# ── Endpoints ──────────────────────────────────────────────────────────────────

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}


@app.post('/pipelines/parse')
def parse_pipeline(pipeline: Pipeline):
    num_nodes = len(pipeline.nodes)
    num_edges = len(pipeline.edges)
    dag = is_dag(pipeline.nodes, pipeline.edges)

    return {
        'num_nodes': num_nodes,
        'num_edges': num_edges,
        'is_dag': dag,
    }