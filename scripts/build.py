from pathlib import Path
import re
root=Path(__file__).resolve().parent.parent
orbit=(root/'vendor'/'OrbitControls.js').read_text(encoding='utf-8')
orbit=re.sub(r'import\s*\{(.*?)\}\s*from\s*[\'"]three[\'"];',r'const {\1} = THREE;',orbit,flags=re.S)
orbit=re.sub(r'export\s*\{[^}]+\};?', '',orbit)
exporter=(root/'vendor'/'GLTFExporter.js').read_text(encoding='utf-8')
exporter=re.sub(r'import\s*\{(.*?)\}\s*from\s*[\'"]three[\'"];',r'const {\1} = THREE;',exporter,flags=re.S)
exporter=re.sub(r'import\s*\{[^}]+\}\s*from[^;]+;', 'function decompress(){throw new Error("Compressed textures are not used in this model");}',exporter)
exporter=re.sub(r'export\s*\{[^}]+\};?', '',exporter)
# Keep library bindings isolated from one another.
orbit='var OrbitControls = (()=>{'+orbit+';return OrbitControls;})();'
exporter='var GLTFExporter = (()=>{'+exporter+';return GLTFExporter;})();'
html=(root/'src'/'shell.html').read_text(encoding='utf-8')
for key,value in [('THREE_LIBRARY',(root/'vendor'/'three.min.js').read_text(encoding='utf-8')),('ORBIT_LIBRARY',orbit),('EXPORTER_LIBRARY',exporter),('SCENE_CODE',(root/'src'/'scene.js').read_text(encoding='utf-8'))]:
 html=html.replace('/* '+key+' */',value.replace('</script','<\\/script'))
out=root/'public'/'index.html'
out.write_text(html,encoding='utf-8')
(root/'public'/'Blossom-School-3D.html').write_text(html,encoding='utf-8')
print('Built',out,out.stat().st_size,'bytes')
