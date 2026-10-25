from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException

from app.services.elexon import ElexonUnavailableError
from config import logger


def register_error_handlers(app: FastAPI) -> None:
    """Errors are returned as {"message": ...}, the shape the web ApiClient reads."""

    @app.exception_handler(HTTPException)
    async def handle_http_error(_: Request, error: HTTPException) -> JSONResponse:
        return JSONResponse({"message": str(error.detail)}, error.status_code)

    @app.exception_handler(RequestValidationError)
    async def handle_validation_error(
        _: Request, error: RequestValidationError
    ) -> JSONResponse:
        first_error = error.errors()[0]
        field = ".".join(str(part) for part in first_error["loc"][1:])
        return JSONResponse({"message": f"{field}: {first_error['msg']}"}, 422)

    @app.exception_handler(ElexonUnavailableError)
    async def handle_elexon_unavailable(
        _: Request, error: ElexonUnavailableError
    ) -> JSONResponse:
        logger.exception("Elexon request failed", exc_info=error)
        return JSONResponse(
            {"message": "Elexon data is temporarily unavailable. Try again shortly."},
            502,
        )
