from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import os
from pathlib import Path

app = FastAPI()


class CalcRequest(BaseModel):
    expression: str


@app.post("/api/calc")
async def calculate(request: CalcRequest):
    """
    Calculate mathematical expression and return result as JSON.
    Supports basic arithmetic operations: +, -, *, /, %, **
    """
    try:
        # Validate expression contains only allowed characters
        allowed_chars = set("0123456789+-*/.% ()")
        if not all(c in allowed_chars for c in request.expression):
            raise ValueError("Invalid characters in expression")
        
        # Evaluate the expression
        result = eval(request.expression)
        
        # Ensure result is a number
        if not isinstance(result, (int, float)):
            raise ValueError("Expression did not return a number")
        
        return {
            "expression": request.expression,
            "result": result,
            "success": True
        }
    except ZeroDivisionError:
        raise HTTPException(status_code=400, detail="Division by zero")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid expression: {str(e)}")


# Mount static files AFTER routes so API endpoints take precedence
static_dir = Path(__file__).parent / "static"
if static_dir.exists():
    app.mount("/", StaticFiles(directory=str(static_dir), html=True), name="static")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)