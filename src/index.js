const canvasSketch = require("canvas-sketch");

const fs = require('fs');
const csv = require('csv');

// Import ThreeJS and assign it to global scope
// This way examples/ folder can use it too
const THREE = require("three");
global.THREE = THREE;

//import { ThreeBSP } from "threebsp";

// const CSG = require("three-csg");
// global.CSG = CSG;
//const ThreeBSP = require("threebsp");
//global.ThreeBSP = ThreeBSP;

// Import extra THREE plugins
require("three/examples/js/controls/OrbitControls");

const Stats = require("stats-js");
const { GUI } = require("dat.gui");


// CSVファイルを文字列として取得
let srt = new XMLHttpRequest();

srt.open("get", 'src/stone 3.csv', false);

try {
  srt.send(null);
} catch (err) {
  alert(err);
}

// 配列を用意
let csletr = [];

// 改行ごとに配列化
let lines = srt.responseText.split(/\r\n|\n/);

// 表示
//alert(lines);

// 1行ごとに処理
for (let i = 0; i < lines.length; ++i) {
  let cells = lines[i].split(",");
  if (cells.length != 1) {
    csletr.push(cells);
  }
}

//ローカルcsv
// 1: ボタンを取得してchangeイベントの設定
var loadBtn = document.querySelector("#loadBtn");
loadBtn.addEventListener("change", upload, false);

function upload(event) {
  // 2：chekFileReader関数でFileAPIにブラウザが対応してるかチェック
  if (!checkFileReader()) {
    alert("エラー：FileAPI非対応のブラウザです。");
  } else {
    // 3: 選択されたファイル情報を取得
    var file = event.target.files[0];
    var type = file.type; // MIMEタイプ
    var size = file.size; // ファイル容量（byte）
    var limit = 10000; // byte, 10KB

    // MIMEタイプの判定
    if (type == "image/jpeg") {
      alert("画像はアップロードできません");
      loadBtn.value="";
      return;
    }

    //readerオブジェクトを作成
    var reader = new FileReader();
    // ファイル読み取りを実行
    reader.readAsText(file);

    // 4：CSVファイルを読み込む処理とエラー処理をする
    reader.onload = function(event) {
      var result = event.target.result;
      makeCSV(result);
    };

    //読み込めなかった場合のエラー処理
    reader.onerror = function() {
      alert("エラー：ファイルをロードできません。");
    };
  }
}

//csvをうまく出力する
function makeCSV(csvdata) {
  //csvデータを1行ごとに配列にする
  var tmp = csvdata.split("\n");

  //６：1行のデータから各項目（各列）のデータを取りだして、2次元配列にする
  csletr = [];
  for (var i = 0; i < tmp.length; i++) {
    //csvの1行のデータを取り出す
    var row_data = tmp[i];

    /*各行の列のデータを配列にする
    csletr[
        [1列目、2列目、3列目]　←1行目のデータ　
        [1列目、2列目、3列目]　←2行目のデータ　
        [1列目、2列目、3列目]　←3行目のデータ　
        ]
    */

        csletr[i] = row_data.split(",");
    //7：dataに入ってる各列のデータを出力する為のデータを作る
  }
}
// ファイルアップロード判定
function checkFileReader() {
  var isUse = false;
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    isUse = true;
  }
  return isUse;
}



// const x = csletr[0];
// const y = csletr[1];
// const r = csletr[2];
// const p = csletr[3];
// var r_stock = [r[0]];
// var r_boolean = true;
// var p_stock = [p[0]];
// var p_boolean = true;

// for (let i = 0; i < r.length; i++) {
//   for (let j = 0; j < r_stock.length; j++) {
//     if (r_stock[j] == r[i]) {
//       r_boolean = false;
//     }
//   }
//   if (r_boolean) {
//     r_stock.push(r[i]);
//   }
//   r_boolean = true;
// }

// for (let i = 0; i < p.length; i++) {
//   for (let j = 0; j < p_stock.length; j++) {
//     if (p_stock[j] == p[i]) {
//       p_boolean = false;
//     }
//   }
//   if (p_boolean) {
//     p_stock.push(p[i]);
//   }
//   p_boolean = true;
// }


const settings = {
  animate: true,
  context: "webgl",
  resizeCanvas: false,
};


const radius = 5 / 2;
const widthSegments = 20;
const HeightSegments = 20;


const sketch = ({ context, canvas }) => {
  const x = csletr[0];
const y = csletr[1];
const r = csletr[2];
const p = csletr[3];
var r_stock = [r[0]];
var r_boolean = true;
var p_stock = [p[0]];
var p_boolean = true;

for (let i = 0; i < r.length; i++) {
  for (let j = 0; j < r_stock.length; j++) {
    if (r_stock[j] == r[i]) {
      r_boolean = false;
    }
  }
  if (r_boolean) {
    r_stock.push(r[i]);
  }
  r_boolean = true;
}

for (let i = 0; i < p.length; i++) {
  for (let j = 0; j < p_stock.length; j++) {
    if (p_stock[j] == p[i]) {
      p_boolean = false;
    }
  }
  if (p_boolean) {
    p_stock.push(p[i]);
  }
  p_boolean = true;
}
  const stats = new Stats();
  //document.body.appendChild(stats.dom);
  //const gui = new GUI();

  const options = {
    enableSwoopingCamera: false,
  };

  // Setup
  // -----

  const renderer = new THREE.WebGLRenderer({ context, alpha: true, });
  renderer.context.getExtension('EXT_shader_texture_lod');
  //renderer.setClearColor(0xf7f7f7, 1);
  renderer.setClearColor(0x000000, 1);
  renderer.shadowMap.enabled = true;
  //renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 10000);
  camera.position.set(0, 0, 200);

  const controls = new THREE.OrbitControls(camera, canvas);
  controls.enabled = !options.enableSwoopingCamera;
//   controls.enableDamping = true;
// controls.dampingFactor = 0.2;

  const scene = new THREE.Scene();

  //const light = new THREE.DirectionalLight(0xfff0dd, 1);
  const light = new THREE.SpotLight(0xfff0dd, 0.5);
  light.position.set(radius * 2 + 100, radius * 2, 100);
  light.castShadow = true;
  light.shadow.mapSize.set(5200, 5200);
  scene.add(light);

  // const helper = new THREE.SpotLightHelper(light, 5);
  //helper.setClearColor(0x474747, 1);
  //scene.add(helper);

  const light2 = new THREE.DirectionalLight(0xfff0dd, 0.3);
  light2.position.set(radius * 2, radius * 2, 100);
  light2.castShadow = true;
  light2.shadow.mapSize.set(5200, 5200);
  light2.shadow.camera.near = 0.5; // default
  light2.shadow.camera.far = 500; // default
  scene.add(light2);


  // Content
  // -------

  //背景
  const mapTexture = new THREE.TextureLoader().load("src/mapping.jpeg");
  var mesh = new THREE.Mesh(new THREE.SphereGeometry(500, 32, 16), new THREE.MeshBasicMaterial({ map: mapTexture }));
  mesh.scale.x = -1;
  scene.add(mesh);

  // 正距円筒図法反射マッピングのテクスチャの読み込み
  const textureLoader = new THREE.TextureLoader();
  const textureEquirec = textureLoader.load("src/mapping.jpeg");
  textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
  textureEquirec.magFilter = THREE.LinearFilter;
  textureEquirec.minFilter = THREE.LinearMipMapLinearFilter;

  //キューブ環境マッピングのテクスチャの読み込み
  const urls = [
    'src/posx.png', 'src/negx.png',
    'src/posy.png', 'src/negy.png',
    'src/posz.png', 'src/negz.png',
  ];
  // const loader = new THREE.CubeTextureLoader();
  // const textureCube = loader.load(urls);
  // textureCube.mapping = THREE.CubeReflectionMapping; //反射マッピングの設定



  const material3 = [];
  var thick=0;
  for (let i = 0; i < r_stock.length; i++) {
    if (r_stock[i] < 4) {
      thick = r_stock[i]*1.7;
      //alert(r);
    } else {
      thick = 4 * 2;
    }
    material3.push(new THREE.MeshPhysicalMaterial({
      roughness: 0.05,
      transmission: 0.9,
      thickness: thick,
      reflectivity: 1,
      ior: 1.5,
      //envMap: textureEquirec,
    }))
  }



  const bgTexture0 = new THREE.TextureLoader().load("src/white2.png");
  const material0 = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0,
    transmission: 0,
    thickness: 0,
    reflectivity: 0,
    //clearcoatNormalMap: bgTexture0,
    //specularIntensityMap: bgTexture,
    map: bgTexture0,
    envMap: textureEquirec,
    //clearcoat: 0.5,
    ior: 0,
    //specularIntensity: 1,
    //specularColorMap: bgTexture0,
    //ior: 1.5,*/
  });

  const bgTexture = [];
  const material2 = [];

  for (let i = 0; i < p_stock.length; i++) {
    bgTexture.push(new THREE.TextureLoader().load("src/P" + parseInt(p_stock[i]) + ".png"));
    material2.push(new THREE.MeshPhysicalMaterial({
      color: 0xfcfcfc,
      roughness: 0,
      transmission: 0,
      thickness: 1,
      reflectivity: 0,
      clearcoatNormalMap: bgTexture[i],
      //specularIntensityMap: bgTexture,
      map: bgTexture[i],
      envMap: textureEquirec,
      clearcoat: 0.5,
      ior: 4,
      specularIntensity: 1,
      specularColorMap: bgTexture[i],
      //sheen : 1
    }))
  }
  /*onst bgTexture = new THREE.TextureLoader().load("src/P" + parseInt(p[0]) + ".png");
  const material2 = new THREE.MeshPhysicalMaterial({
    color: 0xfcfcfc,
    roughness: 0,
    transmission: 0,
    thickness: 1,
    reflectivity: 0,
    clearcoatNormalMap: bgTexture,
    //specularIntensityMap: bgTexture,
    map: bgTexture,
    envMap: textureEquirec,
    clearcoat: 0.5,
    ior: 4,
    specularIntensity: 1,
    specularColorMap: bgTexture,
    //sheen : 1
  });*/

  var maxx = Math.max.apply(null, x);
  var minx = Math.min.apply(null, x);
  var maxy = Math.max.apply(null, y);
  var miny = Math.min.apply(null, y);



  for (let i = 0; i < x.length; i++) {
    for (let j = 0; j < p_stock.length; j++) {
      const a = p_stock[j];
      const b = p[i];
      if (a == b) {
        const pmesh = new THREE.Mesh(new THREE.CircleGeometry(px(r[i] / 2), widthSegments), material2[j]);
        pmesh.position.set((x[i] - minx) / 2-(maxx - minx) / 4, -(y[i] - miny) / 2+(maxy - miny) / 4, 0);
        pmesh.castShadow = true;
        pmesh.receiveShadow = true;
        scene.add(pmesh);
      }
    }

    /*const pmesh = new THREE.Mesh(new THREE.CircleGeometry(px(r[i] / 2), widthSegments), material2 );
        //pmesh.rotateX(Math.PI);
        pmesh.position.set((x[i] - x[0]) / 2, -(y[i] - y[0]) / 2, 0);
        pmesh.castShadow = true;
        pmesh.receiveShadow = true;
        scene.add(pmesh);*/


    for (let j = 0; j < r_stock.length; j++) {
      const a = r_stock[j];
      const b = r[i];
      if (a == b) {
        if(r[i]<=4){
          var R = (Math.pow(r[i] / 2, 2) + Math.pow(r[i] / 2, 2)) / (r[i] / 2);
        }else{
          var R = (Math.pow(r[i] / 2, 2) + Math.pow(2, 2)) / 2;
        }
        const mesh = new THREE.Mesh(new THREE.SphereGeometry(px(R/*r[i]*/ / 2), widthSegments, HeightSegments/*, 0, 2 * Math.PI, 0, 0.5 * Math.PI*/), material3[j]);
        mesh.rotateX(Math.PI / 2);
        if(r[i]<=4){
          mesh.position.set((x[i] - minx) / 2-(maxx - minx) / 4, -(y[i] - miny) / 2+(maxy - miny) / 4, 0);
        }else{
          mesh.position.set((x[i] - minx) / 2-(maxx - minx) / 4, -(y[i] - miny) / 2+(maxy - miny) / 4, -(px(R/2)-px(2)));
        }
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add(mesh);
      }
    }

    /*const cirmesh = new THREE.Mesh(new THREE.CircleGeometry(px(r[i] / 2),widthSegments),material3);
    cirmesh.rotateX(Math.PI);
    cirmesh.position.set((x[i] - x[0]) / 2, -(y[i] - y[0]) / 2, 0);
    cirmesh.castShadow = true;
    cirmesh.receiveShadow = true;
    scene.add(cirmesh);*/
    //}
  }

  //const mediaGeometry = new THREE.Mesh(new THREE.BoxGeometry(/*minx / 2.0 - px(10), miny / 2.0 - px(10),*/ (maxx - minx) / 2 + px(20), (maxy - miny) / 2 + px(20),10));
  const mediaGeometry = new THREE.PlaneGeometry((maxx - minx) / 2 + px(20)/*+110*/, (maxy - miny) / 2 + px(20)/*-20*/);
  //mediaGeometry.rotateX(Math.PI / 2);
  const mediaMesh = new THREE.Mesh(mediaGeometry, material0);
  mediaMesh.position.set(0, 0, -1);
  //mediaMesh.castShadow = true;
  //mediaMesh.receiveShadow = true;
  scene.add(mediaMesh);

  // const geometry = new THREE.IcosahedronGeometry(1, 0);


  // const mesh3 = new THREE.Mesh(new THREE.SphereGeometry(px(r[0] / 2), widthSegments, HeightSegments), material2);
  //   mesh3.rotateX(Math.PI / 2);
  //   mesh3.position.set(0,0, 20);
  //   scene.add(mesh3);

  //   const mesh4 = new THREE.Mesh(new THREE.BoxGeometry(widthSegments, widthSegments, HeightSegments));
  //   mesh4.rotateX(Math.PI / 2);
  //   mesh4.position.set(0,0, 10);
  //   scene.add(mesh4);

  //    const bsp_A = new ThreeBSP(mesh3);
  // const bsp_Y = new CSG(mesh4);

  //mesh3.updateMatrix();
  //mesh4.updateMatrix();

  //const mesh5 = CSG.subtract(mesh3, mesh4);
  //  scene.add(mesh5);




  // GUI
  // ---

  // gui.add(options, "enableSwoopingCamera").onChange((val) => {
  //   controls.enabled = !val;
  //   controls.reset();
  // });

  // Update
  // ------

  const update = (time, deltaTime) => {
    const ROTATE_TIME = 30; // Time in seconds for a full rotation
    const xAxis = new THREE.Vector3(1, 0, 0);
    const yAxis = new THREE.Vector3(0, 1, 0);
    const rotateX = (deltaTime / ROTATE_TIME) * Math.PI * 2;
    const rotateY = (deltaTime / ROTATE_TIME) * Math.PI * 2;

    mesh.rotateOnWorldAxis(xAxis, rotateX);
    mesh.rotateOnWorldAxis(yAxis, rotateY);

    if (options.enableSwoopingCamera) {
      camera.position.x = Math.sin((time / 10) * Math.PI * 2) * 3;
      camera.position.y = Math.cos((time / 10) * Math.PI * 2) * 3;
      camera.position.z = 4;
      camera.lookAt(scene.position);
    }
  };

  // Lifecycle
  // ---------

  return {
    resize({ canvas, pixelRatio, viewportWidth, viewportHeight }) {
      const dpr = Math.min(pixelRatio, 2); // Cap DPR scaling to 2x

      canvas.width = viewportWidth * dpr;
      canvas.height = viewportHeight * dpr;
      canvas.style.width = viewportWidth + "px";
      canvas.style.height = viewportHeight + "px";

      renderer.setPixelRatio(dpr);
      renderer.setSize(viewportWidth, viewportHeight);

      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    render({ time, deltaTime }) {
      //stats.begin();
      controls.update();
      update(time, deltaTime);
      renderer.render(scene, camera);
      //stats.end();
    },
    unload() {
      geometry.dispose();
      material.dispose();
      controls.dispose();
      renderer.dispose();
      //gui.destroy();
      //document.body.removeChild(stats.dom);
    },
  };
};

function px(a) {//mm→px
  return a * 72 / 25.4;
}

//canvasSketch(sketch, settings);


document.getElementById("text-button").onclick = function() {
  document.getElementById("text").innerHTML = "アップロード";
  canvasSketch(sketch, settings);
};
