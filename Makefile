.PHONY: help serve serve-python serve-node

help:
	@echo "Aayug Organics Store Clone - Local Dev Server Help:"
	@echo "  make serve          - Serves the storefront locally at http://localhost:8000 (auto-detects Python)"
	@echo "  make serve-python   - Serves the storefront using Python's built-in http.server"
	@echo "  make serve-node     - Serves the storefront using Node's npx http-server"

serve: serve-python

serve-python:
	@echo "Starting local web server at http://localhost:8000..."
	python -m http.server 8000

serve-node:
	@echo "Starting local web server at http://localhost:8000..."
	npx -y http-server -p 8000
