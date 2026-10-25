import gunicorn.app.base

from app.main import app


class GunicornApp(gunicorn.app.base.BaseApplication):
    def __init__(self, app, options=None):
        self.app = app
        self.options = options or {}
        super().__init__()

    def load(self):
        return self.app

    def load_config(self):
        for key, value in self.options.items():
            self.cfg.set(key, value)


def main():
    options = {
        "bind": "0.0.0.0:3001",
        "workers": 4,
        "worker_class": "uvicorn.workers.UvicornWorker",
    }
    GunicornApp(app, options).run()
