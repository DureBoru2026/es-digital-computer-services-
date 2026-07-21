import re

with open('server.ts', 'r') as f:
    content = f.read()

# Make all handlers async
content = re.sub(r'app\.([a-z]+)\(([^,]+),\s*(?:authenticateAdmin,\s*)?\(req: Request, res: Response\)\s*=>\s*\{',
                 lambda m: m.group(0).replace('(req: Request, res: Response) =>', 'async (req: Request, res: Response) =>'), content)

# Await all db calls
content = re.sub(r'db\.(get|save)([A-Za-z]+)\(', r'await db.\1\2(', content)

with open('server.ts', 'w') as f:
    f.write(content)
