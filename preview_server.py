from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import functools, webbrowser, os, subprocess
root=Path(__file__).resolve().parent
class Handler(SimpleHTTPRequestHandler):
    extensions_map={**SimpleHTTPRequestHandler.extensions_map,'.mjs':'application/javascript','.wasm':'application/wasm'}
for port in range(8865,8876):
    try:
        server=ThreadingHTTPServer(('127.0.0.1',port),functools.partial(Handler,directory=str(root)))
        break
    except OSError:
        continue
else:
    raise SystemExit('No free preview port between 8865 and 8875.')
url=f'http://127.0.0.1:{port}/'
print('Jenga Code Compiler Studio:',url,flush=True)
opened=False
if os.name=='nt':
    for base in ('PROGRAMFILES','PROGRAMFILES(X86)','LOCALAPPDATA'):
        chrome=Path(os.environ.get(base,''))/'Google/Chrome/Application/chrome.exe'
        if chrome.is_file():
            subprocess.Popen([str(chrome),'--new-window',url])
            opened=True
            break
if not opened:
    try:
        webbrowser.get('chrome').open(url)
    except webbrowser.Error:
        webbrowser.open(url)
try:
    server.serve_forever()
except KeyboardInterrupt:
    server.server_close()
