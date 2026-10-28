/* Blossom School: modeled from supplied photographs. Units are illustrative. */
'use strict';
const mount=document.getElementById('scene');
const scene=new THREE.Scene(); scene.background=new THREE.Color('#e9eee8');
const camera=new THREE.PerspectiveCamera(37,innerWidth/innerHeight,.2,1800);
const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true,powerPreference:'high-performance'});
renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));
renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.06;
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;mount.appendChild(renderer.domElement);
const world=new THREE.Group();world.name='Blossom School complete diorama';scene.add(world);
const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.065;controls.minDistance=20;controls.maxDistance=850;controls.maxPolarAngle=Math.PI*.475;controls.minPolarAngle=.12;controls.autoRotate=true;controls.autoRotateSpeed=.55;controls.target.set(-4,1,0);camera.position.set(126,113,173);controls.update();
scene.add(new THREE.HemisphereLight(0xddeeff,0x728454,2.25));
const sun=new THREE.DirectionalLight(0xfff1d9,3.1);sun.position.set(-65,110,75);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-110,right:110,top:90,bottom:-90,near:1,far:270});sun.shadow.normalBias=.13;sun.shadow.bias=-.0003;sun.shadow.radius=3;scene.add(sun);
const fill=new THREE.DirectionalLight(0xe1efff,.75);fill.position.set(70,40,-70);scene.add(fill);
let seed=64271;function rand(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}function range(a,b){return a+(b-a)*rand()}
function mat(c,rough=.85,extra={}){return new THREE.MeshStandardMaterial({color:c,roughness:rough,...extra})}
const M={cream:mat('#edead8'),white:mat('#faf8e8'),blue:mat('#1676b2'),blueDark:mat('#185c82'),glass:mat('#24464d',.28,{metalness:.25}),iron:mat('#223a3d',.55,{metalness:.6}),stone:mat('#aaa998'),stoneDark:mat('#737d75'),road:mat('#353e40'),line:mat('#ecebdc'),curb:mat('#ebeadb'),curbDark:mat('#303b3c'),path:mat('#bfae8e'),soil:mat('#65533c'),trunk:mat('#6c5943'),green1:mat('#416c2b'),green2:mat('#5b8431'),green3:mat('#729440'),green4:mat('#34654a'),bush:mat('#4e7935'),yellow:mat('#e5c54e'),pink:mat('#f3b2c6'),pink2:mat('#e893b1'),pink3:mat('#ffd5dd'),terra:mat('#ad6650'),bench:mat('#316660'),black:mat('#202d30'),bus:mat('#eebd27'),red:mat('#ad4836'),silver:mat('#b3bbb5'),base:mat('#30443d'),gold:mat('#bcaa74',.55,{metalness:.35})};
const geo={box:new THREE.BoxGeometry(1,1,1),ball:new THREE.IcosahedronGeometry(1,2),leaf:new THREE.IcosahedronGeometry(1,1),cyl:new THREE.CylinderGeometry(1,1,1,10),cone:new THREE.ConeGeometry(1,1,10)};
const batches=new Map();const dummy=new THREE.Object3D();
function inst(g,m,x,y,z,sx=1,sy=1,sz=1,rx=0,ry=0,rz=0){let key=g.uuid+m.uuid;if(!batches.has(key))batches.set(key,{g,m,list:[]});dummy.position.set(x,y,z);dummy.rotation.set(rx,ry,rz);dummy.scale.set(sx,sy,sz);dummy.updateMatrix();batches.get(key).list.push(dummy.matrix.clone())}
function box(x,y,z,w,h,d,m,ry=0){inst(geo.box,m,x,y,z,w,h,d,0,ry)}
function ball(x,y,z,sx,sy,sz,m){inst(geo.leaf,m,x,y,z,sx,sy,sz,rand(),rand())}
function cyl(x,y,z,r,h,m){inst(geo.cyl,m,x,y,z,r,h,r)}
function rod(a,b,r,m){const aa=new THREE.Vector3(...a),bb=new THREE.Vector3(...b),v=bb.clone().sub(aa);dummy.position.copy(aa.add(bb).multiplyScalar(.5));dummy.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.clone().normalize());dummy.scale.set(r,v.length(),r);dummy.updateMatrix();const key=geo.cyl.uuid+m.uuid;if(!batches.has(key))batches.set(key,{g:geo.cyl,m,list:[]});batches.get(key).list.push(dummy.matrix.clone())}
function mesh(g,m,x=0,y=0,z=0,parent=world){let a=new THREE.Mesh(g,m);a.position.set(x,y,z);a.castShadow=true;a.receiveShadow=true;parent.add(a);return a}
function flush(){for(const {g,m,list} of batches.values()){let a=new THREE.InstancedMesh(g,m,list.length);list.forEach((v,i)=>a.setMatrixAt(i,v));a.castShadow=true;a.receiveShadow=true;a.name='Campus details '+m.color.getHexString();world.add(a)}batches.clear()}
function canvasTexture(w,h,draw){let c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);let t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=renderer.capabilities.getMaxAnisotropy();return t}
const grassTex=canvasTexture(512,512,(c,w,h)=>{c.fillStyle='#658b38';c.fillRect(0,0,w,h);for(let i=0;i<37000;i++){c.fillStyle=['#8ea64b','#4c732c','#7b963d','#567c2d'][i%4];c.globalAlpha=.28;c.fillRect(rand()*w,rand()*h,1,range(1,4))}c.globalAlpha=1});grassTex.wrapS=grassTex.wrapT=THREE.RepeatWrapping;grassTex.repeat.set(8,6);M.grass=mat('#d4dcab',1,{map:grassTex});
const pathTex=canvasTexture(256,256,(c,w,h)=>{c.fillStyle='#c4b392';c.fillRect(0,0,w,h);c.strokeStyle='#a9987e';c.lineWidth=2;for(let y=0;y<256;y+=32){c.beginPath();c.moveTo(0,y);c.lineTo(w,y);c.stroke();for(let x=(y%64?16:0);x<w;x+=32){c.beginPath();c.moveTo(x,y);c.lineTo(x,y+32);c.stroke()}}});pathTex.wrapS=pathTex.wrapT=THREE.RepeatWrapping;pathTex.repeat.set(12,2);M.paving=mat('#fff3d9',1,{map:pathTex});
function sign(text,sub,w,h,x,y,z,rot=0){let tex=canvasTexture(1536,256,(c,W,H)=>{c.fillStyle='#f5f2df';c.fillRect(0,0,W,H);c.strokeStyle='#2372a2';c.lineWidth=10;c.strokeRect(8,8,W-16,H-16);c.textAlign='center';c.fillStyle='#184775';c.font=text.length<10?'bold 175px Arial':'bold 83px Arial';c.fillText(text,W/2,text.length<10?185:112);if(sub){c.font='bold 43px Arial';c.fillText(sub,W/2,188)}});let a=mesh(new THREE.BoxGeometry(w,h,.15),[M.white,M.white,M.white,M.white,mat('#ffffff',1,{map:tex}),M.white],x,y,z);a.rotation.y=rot;return a}
// The plinth, gently stepped edges and campus terrain.
box(-5,-2.5,0,163,5,106,M.base);box(-5,-.3,0,164,.45,107,M.gold);box(-5,0,0,163,.45,106,M.grass);
box(9,.24,1,84,.3,68,M.grass);box(10,.44,4,74,.18,49,M.paving);box(9,.56,5,63,.22,39,M.grass);
// Closed front wall. The only school entrance is on the right boundary.
function wallX(x1,x2,z){box((x1+x2)/2,1.75,z,x2-x1,2.6,.65,M.cream);box((x1+x2)/2,3.11,z,x2-x1,.16,.84,M.blue);for(let x=x1;x<=x2+.1;x+=6.5){box(x,1.8,z,.65,2.9,.95,M.blue);box(x,3.3,z,.9,.18,1.12,M.white)}}
function wallZ(x,z1,z2){box(x,1.75,(z1+z2)/2,.65,2.6,z2-z1,M.cream);box(x,3.11,(z1+z2)/2,.84,.16,z2-z1,M.blue);for(let z=z1;z<=z2+.1;z+=6.5){box(x,1.8,z,.95,2.9,.65,M.blue);box(x,3.3,z,1.12,.18,.9,M.white)}}
wallX(-32,52,32);wallX(-32,52,-32);wallZ(-32,-32,32);wallZ(52,-32,7);wallZ(52,19,32);
// Two-storey classroom building, recessed corridors, grilles and roof pavilion.
box(9,.65,-22,78,1.0,16,M.stone);box(9,1.05,-20,77,.36,16.8,M.white);
box(9,6.5,-23,75,10.8,9.5,M.cream);box(9,2.1,-17.95,75,2.1,.18,M.blue);box(9,7.45,-17.95,75,.65,.18,M.blueDark);
box(9,6.2,-15.6,78,.42,5.0,M.white);box(9,12.05,-21.5,79,.45,16.3,M.white);
box(9,6.75,-13.15,78,1.2,.45,M.cream);box(9,7.4,-13.12,78,.12,.53,M.blueDark);
box(9,12.45,-13.35,79,.55,.35,M.cream);box(9,12.45,-29.5,79,.55,.35,M.cream);
for(let x=-30;x<=48;x+=7.8){box(x,3.75,-13.5,.48,5.3,.48,M.white);box(x,1.85,-13.5,.5,1.7,.5,M.blue);box(x,9.25,-13.5,.48,5.35,.48,M.white);box(x,11.65,-15.4,.42,.34,4.2,M.cream)}
for(let floor=0;floor<2;floor++)for(let j=0;j<10;j++){let x=-26.1+j*7.8,y=4.1+floor*5.55;let door=j%3===1;let ww=door?1.75:3.7,hh=door?3.7:2.05;box(x,y-(door?.8:0),-17.79,ww,hh,.2,M.glass);for(let k=0;k<=4;k++)box(x-ww/2+k*ww/4,y-(door?.8:0),-17.61,.055,hh,.07,M.iron);for(let k=0;k<=3;k++)box(x,y-hh/2+(door?-.8:0)+k*hh/3,-17.6,ww,.05,.08,M.iron);box(x,y+hh/2+(door?-.8:0)+.12,-17.65,ww+.3,.17,.35,M.white);if(door)ball(x+.55,y-.8,-17.45,.06,.06,.06,M.gold);box(x,5.85+floor*5.55,-17.4,.3,.12,.25,M.iron)}
// Back and side elevations are modeled for full 360-degree viewing.
for(let floor=0;floor<2;floor++)for(let j=0;j<10;j++){let x=-26+j*7.8,y=4+floor*5.5;box(x,y,-27.82,3.1,2,.12,M.glass);for(let k=-1;k<=1;k++)box(x+k*.85,y,-27.92,.07,2,.07,M.iron);box(x,y,-27.94,3.1,.07,.07,M.iron)}
box(9,2,-27.85,75,2,.1,M.blue);box(9,6.4,-27.94,77,.32,.4,M.white);
for(let x of [-28.55,46.55])for(let y of [3.7,9.3]){box(x,y,-23, .15,2.1,3.0,M.glass);for(let z=-24.3;z<-21.5;z+=.65)box(x+(x<0?-.1:.1),y,z,.06,2.1,.06,M.iron)}
box(-18,13.65,-23,17,2.6,7.5,M.cream);box(-18,15.17,-23,18,.28,9,M.terra);for(let x=-27;x<=-9;x+=.32)box(x,15.36,-23,.07,.13,9,M.red);
sign('BLOSSOM KINDERGARTEN SCHOOL','RISHI KUNJ · BANSWARA',27,2.35,-11,13.35,-13.14);
// Steps and walkway in front of the school.
box(9,.83,-11.9,78,.35,1.7,M.white);box(9,.61,-11,78,.2,1.6,M.stone);box(9,.43,-10.2,78,.15,1.1,M.path);
function bench(x,z,ry=0){let p=(dx,dy,dz,w,h,d,m)=>{let xx=x+dx*Math.cos(ry)+dz*Math.sin(ry),zz=z-dx*Math.sin(ry)+dz*Math.cos(ry);box(xx,dy,zz,w,h,d,m,ry)};for(let i=0;i<3;i++)p(0,1.25,-.35+i*.3,2.65,.15,.22,M.bench);for(let i=0;i<3;i++)p(0,1.65+i*.27,-.64,2.65,.19,.12,M.bench);for(let a of [-.92,.92]){p(a,.85,0,.13,1.1,.85,M.iron);p(a,1.45,-.58,.1,1.5,.12,M.iron)}}
for(let x=-22;x<=41;x+=15.5)bench(x,-10.3);bench(-25,15,Math.PI/2);bench(44,0,-Math.PI/2);bench(44,24,-Math.PI/2);
function pot(x,z){cyl(x,.85,z,.35,.6,M.terra);cyl(x,1.15,z,.39,.12,M.gold);for(let j=0;j<5;j++)ball(x+range(-.24,.24),1.6+rand()*.25,z+range(-.24,.24),.32,.55,.3,M.green4)}for(let x=-28;x<47;x+=7.8)pot(x,-12);
function tree(x,z,h=6,cherry=false){let r=h*.32;cyl(x,h*.35,z,.21,h*.66,M.trunk);for(let j=0;j<6;j++){let a=j*2.4,dx=Math.cos(a)*r*.8,dz=Math.sin(a)*r*.8;rod([x,h*.35,z],[x+dx,h*.7,z+dz],.085,M.trunk)}for(let j=0;j<28;j++){let a=j*2.399,rr=r*Math.sqrt((j+.5)/28)*.9;ball(x+Math.cos(a)*rr,h*.75+Math.sin(j*1.73)*r*.42,z+Math.sin(a)*rr,r*range(.3,.55),r*range(.35,.6),r*range(.3,.55),cherry?[M.pink,M.pink2,M.pink3][j%3]:[M.green1,M.green2,M.green3,M.green4][j%4])}if(cherry){for(let i=0;i<80;i++){let a=range(0,6.28),rr=range(.1,r*1.5);ball(x+Math.cos(a)*rr,.7,z+Math.sin(a)*rr,.09,.025,.1,[M.pink,M.pink3][i%2])}for(let i=0;i<75;i++){let a=range(0,6.28),rr=range(.7*r,1.25*r);ball(x+Math.cos(a)*rr,h*.75+range(-r*.45,r*.55),z+Math.sin(a)*rr,.12,.1,.12,[M.pink2,M.pink3][i%2])}}}
function shrub(x,z,s=.6){ball(x,.7+s*.5,z,s,s*.8,s,M.bush);ball(x+.35,.7+s*.6,z+.1,s*.7,s*.7,s*.65,M.green2)}
function flowers(x,z){shrub(x,z,.38);for(let i=0;i<5;i++)ball(x+range(-.45,.45),range(.96,1.3),z+range(-.45,.45),.13,.12,.13,M.yellow)}
for(let x=-29;x<=49;x+=2.1){shrub(x,30,.55);flowers(x,-7.9);if(x%3>1)flowers(x,28.8)}
for(let z=-26;z<30;z+=1.25){shrub(-30,z,.5);if(z<7||z>20)shrub(50,z,.5);flowers(-23,z);if(z<6||z>19)flowers(42,z)}
for(let z of [-4,10,24]){tree(-27,z,range(5.4,7.4));if(z!==10)tree(47,z,range(5.4,7.2))}
for(let x=-78;x<73;x+=9)tree(x,-48,range(4.5,7.5));for(let z=-29;z<33;z+=7.5)tree(-35,z,range(5.2,7));
for(let x=-76;x<70;x+=2.8)shrub(x,-46,range(.5,.85));
for(let z=-29;z<32;z+=2.1)shrub(-34.7,z,range(.5,.8));
// A palm at each end of the lawn, echoing the photographs.
function palm(x,z){cyl(x,3.5,z,.22,6,M.trunk);for(let j=0;j<9;j++){let a=j*6.28/9;let end=[x+Math.cos(a)*2.5,6.1,z+Math.sin(a)*2.5];rod([x,6.7,z],end,.13,M.green4);let o=mesh(new THREE.ConeGeometry(.36,3.7,5),M.green4,x+Math.cos(a)*1.5,6.4,z+Math.sin(a)*1.5);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),new THREE.Vector3(Math.cos(a),-.3,Math.sin(a)).normalize())}}palm(-19,-4);palm(37,25);
// Roads join at the east to make a continuous U-shaped route.
box(-6,.34,-40,160,.3,9,M.road);box(-6,.34,43,160,.3,9,M.road);box(65,.34,1.5,9,.3,83,M.road);
function roadStripeX(z){for(let x=-83;x<68;x+=7)box(x,.51,z,3.2,.025,.13,M.line)}roadStripeX(-40);roadStripeX(43);for(let z=-36;z<=40;z+=7)box(65,.51,z,.13,.025,3.2,M.line);
for(let z of [-44.4,-35.6,38.6,47.4])for(let x=-84;x<=69;x+=2)box(x,.66,z,1.95,.36,.48,(Math.round(x/2)%2)?M.curb:M.curbDark);
for(let x of [60.6,69.4])for(let z=-35;z<=37;z+=2)box(x,.66,z,.48,.36,1.95,(Math.round(z)%4)?M.curb:M.curbDark);
// Gate apron interrupts the inner pavement and reaches the connector road.
box(56.5,.58,13,8.2,.13,12,M.paving);for(let z=8;z<=18;z+=1.6)box(61.8,.53,z,2.1,.03,.7,M.line);
function streetLight(x,z,ry=0){cyl(x,4.1,z,.1,7.5,M.silver);rod([x,7.5,z],[x+Math.cos(ry)*1.2,8.05,z+Math.sin(ry)*1.2],.06,M.silver);box(x+Math.cos(ry)*1.25,8.06,z+Math.sin(ry)*1.25,.8,.12,.32,M.iron,ry);box(x+Math.cos(ry)*1.25,7.98,z+Math.sin(ry)*1.25,.65,.06,.26,M.white,ry)}
for(let x=-28;x<70;x+=27)streetLight(x,-35,Math.PI/2);for(let x=-63;x<70;x+=30)streetLight(x,37.5,-Math.PI/2);streetLight(59.5,-18,0);streetLight(59.5,29,0);
// Reservoir and dam occupy the LEFT side of the default front-facing view.
box(-59,.14,-18,38,.35,32,M.stoneDark);box(-59,.05,21,38,.2,44,M.stoneDark);
const waterTexture=canvasTexture(512,512,(c,w,h)=>{c.fillStyle='#247c93';c.fillRect(0,0,w,h);for(let i=0;i<1600;i++){let x=rand()*w,y=rand()*h;c.strokeStyle=i%3?'#4c9fb1':'#9bc9cd';c.globalAlpha=range(.15,.5);c.lineWidth=range(.3,1.2);c.beginPath();c.moveTo(x,y);c.bezierCurveTo(x+3,y-2,x+8,y+2,x+range(9,18),y);c.stroke()}c.globalAlpha=1});waterTexture.wrapS=waterTexture.wrapT=THREE.RepeatWrapping;waterTexture.repeat.set(3,4);
const waterMat=mat('#81c5d3',.25,{map:waterTexture,metalness:.25});
const upstream=mesh(new THREE.PlaneGeometry(35,29,35,30),waterMat,-59,2.95,-19);upstream.rotation.x=-Math.PI/2;upstream.name='Upper reservoir on left';
const water=mesh(new THREE.PlaneGeometry(36,43,36,44),waterMat,-59,.55,21);water.rotation.x=-Math.PI/2;water.name='Downstream river';
// Retaining banks keep the raised reservoir contained.
box(-77,1.7,-19,.8,2.9,30,M.stoneDark);box(-40.6,1.7,-19,.9,2.9,30,M.stoneDark);box(-59,1.7,-33.8,37,2.9,.7,M.stoneDark);
// River bank rocks, irregular turf and planting.
for(let z=-33;z<43;z+=1.65){for(let x of [-78,-40]){let xx=x+range(-.65,.65);ball(xx,range(.45,1),z,range(.5,1.1),range(.5,1),range(.6,1.15),z%3?M.stone:M.stoneDark)}if(z%5<1)shrub(-38,z,.7)}
box(-59,1.95,-2.3,38,3.1,3.2,M.stone);box(-59,3.65,-2.3,39,.42,4.3,M.cream);
const fallTex=canvasTexture(256,512,(c,w,h)=>{c.fillStyle='#4399af';c.fillRect(0,0,w,h);for(let i=0;i<200;i++){c.globalAlpha=range(.15,.75);c.strokeStyle=i%4?'#e6f5ee':'#1e6b8b';c.lineWidth=range(1,5);c.beginPath();let x=rand()*w,y=rand()*h;c.moveTo(x,y);c.bezierCurveTo(x+8,y+30,x-3,y+50,x+3,y+range(40,180));c.stroke()}c.globalAlpha=1});fallTex.wrapS=fallTex.wrapT=THREE.RepeatWrapping;fallTex.repeat.set(1,2);
const fallMat=mat('#b0e0e3',.25,{map:fallTex,side:THREE.DoubleSide});
for(let x=-74;x<=-44;x+=6){box(x,1.85,-.3,4.4,2.3,.28,M.blueDark);box(x-2.65,1.9,.2,.95,3.0,4.7,M.stone);let a=mesh(new THREE.PlaneGeometry(4.3,2.9,4,12),fallMat,x,1.85,1.4);a.rotation.x=-.33;for(let j=0;j<18;j++)ball(x+range(-2.3,2.3),.65+rand()*.13,range(2.1,4.3),range(.18,.45),.09,range(.3,.6),M.white)}
for(let z of [-4.2,-.7]){for(let x=-78;x<-39;x+=3)cyl(x,4.45,z,.055,1.2,M.iron);rod([-78,5.05,z],[-40,5.05,z],.055,M.iron);rod([-78,4.45,z],[-40,4.45,z],.045,M.iron)}
sign('D A M','',7,.85,-59,3.22,.03);box(-36.5,1.15,2.3,4.3,1.1,5.7,M.stone);box(-36.5,3.1,2.3,3.4,3.4,4.5,M.cream);box(-36.5,4.92,2.3,4.1,.32,5.3,M.stoneDark);box(-36.5,3.4,4.6,1.2,1.2,.08,M.glass);
for(let z=-12;z<=8;z+=2.4)shrub(-37,z,.5);
// Right boundary entrance, rotated 90 degrees from the reference front gate.
for(let z of [6.8,19.2]){box(52,3.1,z,1.35,5.5,1.35,M.blue);box(52,6,z,1.9,.35,1.9,M.white);box(52,6.25,z,1.6,.2,1.6,M.gold)}
box(52,6.5,13,1.2,.7,14.2,M.white);sign('BLOSSOM KINDERGARTEN SCHOOL','WELCOME · GROW WITH US',12.8,1.55,52.75,6.65,13,Math.PI/2);
const gateLeaves=[];
function localBox(parent,x,y,z,w,h,d,m){let a=mesh(geo.box,m,x,y,z,parent);a.scale.set(w,h,d);return a}
for(let side of [-1,1]){const g=new THREE.Group();g.position.set(52,.65,13+side*5.5);g.name=side<0?'Gate north leaf':'Gate south leaf';world.add(g);gateLeaves.push({g,side});for(let j=0;j<=11;j++){let zz=-side*j*.5;let hh=3.6+.75*Math.sin(j/11*Math.PI/2);localBox(g,0,hh/2,zz,.12,hh,.09,M.iron);let spear=mesh(new THREE.ConeGeometry(.1,.25,4),M.gold,0,hh+.15,zz,g)}for(let yy of [.25,1.3,3.2])localBox(g,0,yy,-side*2.75,.13,.1,5.5,M.iron);for(let j=0;j<11;j++){let z1=-side*j*.5,z2=-side*(j+1)*.5,y1=3.6+.75*Math.sin(j/11*Math.PI/2),y2=3.6+.75*Math.sin((j+1)/11*Math.PI/2);let a=new THREE.Vector3(0,y1,z1),b=new THREE.Vector3(0,y2,z2),v=b.clone().sub(a);let bar=mesh(geo.cyl,M.iron,...a.add(b).multiplyScalar(.5).toArray(),g);bar.scale.set(.08,v.length(),.08);bar.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize())}}
// Branching flowering vines climb both gateposts and form a canopy.
for(let side of [-1,1]){let z=13+side*6.2;for(let y=.9;y<6.6;y+=.45){let x=52+Math.sin(y*3)*.7;rod([x,y,z+Math.cos(y*3)*.7],[52+Math.sin((y+.45)*3)*.7,y+.45,z+Math.cos((y+.45)*3)*.7],.07,M.trunk);for(let j=0;j<4;j++)ball(x+range(-.28,.28),y+range(-.22,.22),z+range(-.7,.7),.28,.23,.28,[M.pink,M.pink2,M.pink3][j%3])}}
for(let z=6.2;z<20;z+=.42)for(let j=0;j<3;j++)ball(52+range(-.65,.65),7.65+Math.sin((z-6)/14*Math.PI)*.45+range(-.2,.2),z,.44,.32,.44,[M.pink,M.pink2,M.pink3][j]);
tree(48,4.8,6.7,true);tree(48,22,6.7,true);tree(56.5,3.4,6.2,true);tree(56.5,23.7,6.2,true);
// Plinth label is part of the physical model.
sign('BLOSSOM SCHOOL','A CAMPUS IN BLOOM',32,2.9,8,-2.35,53.15);
flush();
// Detailed moving vehicles travel continuously around the connected roads.
const vehicles=[];
function vehicle(type,color,offset,lane=0){let g=new THREE.Group();g.name=type;world.add(g);let bus=type==='School bus',truck=type==='Delivery truck';let len=bus?7.8:truck?8:4.2,w=bus?2.5:truck?2.6:2;localBox(g,0,1.05,0,len,1.2,w,color);localBox(g,bus?-.2:truck?1.2:0,1.95,0,bus?7:truck?4.9:2.4,bus?1.5:truck?2.4:.85,color);let winLen=bus?6.6:truck?1.3:2.1;for(let side of [-1,1]){localBox(g,truck?-2.5:0,2.04,side*(w/2+.02),winLen,.62,.04,M.glass);if(bus)for(let j=-3;j<=3;j++)localBox(g,j,2.04,side*(w/2+.06),.08,.7,.04,M.iron)}localBox(g,-len/2-.02,1.9,0,.04,.7,w*.85,M.glass);for(let xx of [-len*.31,len*.31])for(let zz of [-w/2,w/2]){let wheel=mesh(new THREE.CylinderGeometry(.49,.49,.22,12),M.black,xx,.69,zz,g);wheel.rotation.x=Math.PI/2;let hub=mesh(new THREE.CylinderGeometry(.22,.22,.24,10),M.silver,xx,.69,zz,g);hub.rotation.x=Math.PI/2}for(let zz of [-w*.32,w*.32]){localBox(g,-len/2-.05,1.03,zz,.06,.22,.32,M.white);localBox(g,len/2+.05,1.03,zz,.06,.22,.32,M.red)}vehicles.push({g,offset,speed:bus?5.5:truck?4.8:7.5,lane})}
vehicle('School bus',M.bus,35);vehicle('White car',M.white,88);vehicle('Delivery truck',M.red,130);vehicle('Silver car',M.silver,215);vehicle('Blue car',M.blueDark,300);
// Rounded continuous track: upper road -> right connector -> lower road -> return.
const route=new THREE.CurvePath();const V=(x,z)=>new THREE.Vector3(x,.02,z);
route.add(new THREE.LineCurve3(V(-80,-38),V(61,-38)));route.add(new THREE.QuadraticBezierCurve3(V(61,-38),V(65,-38),V(65,-34)));route.add(new THREE.LineCurve3(V(65,-34),V(65,37)));route.add(new THREE.QuadraticBezierCurve3(V(65,37),V(65,41),V(61,41)));route.add(new THREE.LineCurve3(V(61,41),V(-80,41)));
const routeLen=route.getLength();
// Gentle drifting petals around the entrance.
const petalGeo=new THREE.BufferGeometry(),petalCount=90,petalPos=new Float32Array(petalCount*3);for(let i=0;i<petalCount;i++){petalPos[i*3]=range(46,58);petalPos[i*3+1]=range(.8,8);petalPos[i*3+2]=range(3,24)}petalGeo.setAttribute('position',new THREE.BufferAttribute(petalPos,3));const petals=new THREE.Points(petalGeo,new THREE.PointsMaterial({color:'#f5c0cf',size:.13,transparent:true,opacity:.85}));petals.name='Drifting blossom petals';world.add(petals);
const viewpoints={overview:{pos:[126,113,173],target:[-4,1,0]},school:{pos:[73,42,78],target:[9,5,-15]},dam:{pos:[-103,48,70],target:[-58,2,-1]},gate:{pos:[93,25,46],target:[50,3,13]},top:{pos:[0,157,3],target:[-3,0,0]}};
let transition=null;function view(name){const v=viewpoints[name];const fit=name==='overview'?Math.max(1,1.4/camera.aspect):Math.max(1,.85/camera.aspect);const destination=new THREE.Vector3(...v.pos).sub(new THREE.Vector3(...v.target)).multiplyScalar(fit).add(new THREE.Vector3(...v.target));transition={start:performance.now(),from:camera.position.clone(),to:destination,tf:controls.target.clone(),tt:new THREE.Vector3(...v.target)};controls.autoRotate=false;document.getElementById('rotate').textContent='▶  Resume rotation';document.getElementById('rotate').setAttribute('aria-pressed','false');document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===name))}
document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>view(b.dataset.view));document.getElementById('top').onclick=()=>view('top');
document.getElementById('rotate').onclick=()=>{transition=null;controls.autoRotate=!controls.autoRotate;document.getElementById('rotate').textContent=controls.autoRotate?'Ⅱ  Pause rotation':'▶  Resume rotation';document.getElementById('rotate').setAttribute('aria-pressed',String(controls.autoRotate))};document.getElementById('speed').oninput=e=>controls.autoRotateSpeed=+e.target.value;
controls.addEventListener('start',()=>{transition=null;controls.autoRotate=false;document.getElementById('rotate').textContent='▶  Resume rotation';document.getElementById('rotate').setAttribute('aria-pressed','false')});
let gateOpen=false,gateAngle=0;document.getElementById('gate').onclick=()=>{gateOpen=!gateOpen;document.getElementById('gate').textContent=gateOpen?'Close gate':'Open gate'};
document.getElementById('fullscreen').onclick=async()=>{try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen();else await document.exitFullscreen()}catch(e){toast('Use your browser’s full-screen command to expand the model.')}};
function toast(s){let t=document.getElementById('toast');t.textContent=s;t.style.display='block';setTimeout(()=>t.style.display='none',3500)}function download(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),30000)}
document.getElementById('save').onclick=()=>{renderer.render(scene,camera);renderer.domElement.toBlob(b=>download(b,'blossom-school-view.png'))};
async function buildGLB(){const values=[];for(let i=0;i<=4;i++){const q=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),i*Math.PI/2);values.push(...q.toArray())}const track=new THREE.QuaternionKeyframeTrack(world.uuid+'.quaternion',[0,7.5,15,22.5,30],values);const clip=new THREE.AnimationClip('Campus 360 turntable',30,[track]);return new GLTFExporter().parseAsync(world,{binary:true,onlyVisible:true,maxTextureSize:1024,animations:[clip]})}
async function exportModel(){toast('Preparing the complete 3D model…');try{const data=await buildGLB();download(new Blob([data],{type:'model/gltf-binary'}),'blossom-school.glb');toast('Your 3D model is ready.')}catch(e){console.error(e);toast('The model could not be exported. Please try again.')}}document.getElementById('export').onclick=exportModel;
const initialFit=Math.max(1,1.4/camera.aspect);camera.position.sub(controls.target).multiplyScalar(initialFit).add(controls.target);controls.update();
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
let last=performance.now(),elapsed=0,frames=0;function animate(now){requestAnimationFrame(animate);let dt=Math.min((now-last)/1000,.04);last=now;elapsed+=dt;frames++;if(transition){let t=Math.min((now-transition.start)/1250,1),s=t*t*(3-2*t);camera.position.lerpVectors(transition.from,transition.to,s);controls.target.lerpVectors(transition.tf,transition.tt,s);if(t===1)transition=null}controls.update();waterTexture.offset.x=elapsed*.015;waterTexture.offset.y=-elapsed*.008;fallTex.offset.y=elapsed*.65;gateAngle+=((gateOpen?1.45:0)-gateAngle)*Math.min(1,dt*4);gateLeaves.forEach(({g,side})=>g.rotation.y=-side*gateAngle);for(let v of vehicles){let u=((elapsed*v.speed+v.offset)%routeLen)/routeLen;let p=route.getPointAt(u),tan=route.getTangentAt(u);v.g.position.copy(p);v.g.rotation.y=Math.atan2(-tan.z,-tan.x)}for(let i=0;i<petalCount;i++){petalPos[i*3]+=(.2+Math.sin(elapsed+i)*.3)*dt;petalPos[i*3+1]-=dt*(.3+i%4*.1);if(petalPos[i*3+1]<.8){petalPos[i*3+1]=8;petalPos[i*3]=46+(i%12)}petalPos[i*3+2]+=Math.cos(elapsed*.4+i)*dt*.2}petalGeo.attributes.position.needsUpdate=true;renderer.render(scene,camera);if(frames===2){document.getElementById('loading').style.display='none';renderer.shadowMap.autoUpdate=false}if(frames%180===0&&renderer.info.render.calls>400)renderer.setPixelRatio(1)}requestAnimationFrame(animate);
// Exposed solely for offline export and automated quality checks.
window.schoolModel={scene,world,camera,controls,renderer,view,buildGLB,exporter:()=>new GLTFExporter(),get frames(){return frames},get elapsed(){return elapsed},gateLeaves,vehicles};
