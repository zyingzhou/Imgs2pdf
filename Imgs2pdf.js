/**
 * Convert images to pdf.
 * 
 * Date: 2022.5.4
 * Author: zhiying
 * Env: node and browers
 */
 let {jsPDF}  = require("jspdf"); // will automatically load the node version
 let fs = require('fs');

 /**
  * 
  * @param {图片路径:string} path 
  * @returns a promise include imageData and  the size of image.
  */
 let readImg= function (path){
     return new Promise(resolve=>{
         fs.readFile(path, 'base64',(err, data)=>{
             if (!err){
                //  console.log('文件读取成功，下面开始打印文件\n'); 
                 // use it in browser
                 // img.src= path;
                 // let w = img.width;
                 // let h = img.height;
                 // console.log(data);
                 let doc = new jsPDF('p','pt');
                 let property = doc.getImageProperties(data);
                 let w = property.width;
                 let h = property.height;
                //  console.log(property.fileType);
                //  console.log(w);
                //  console.log(h);
                //  doc.addImage(data, 'JPEG',0,0,w,h);
                 resolve({
                     "imageData": data,
                     "size":[w,h]
                 });
                 
             }
         })  
 
     })
      
     }    
 
/**
 * 
 * @param {要添加的图片的地址:string} path 
 * @returns the first page of pdf 
 */
let addFirstPage = async function(path){
    let image = await readImg(path);
    let pdf = new jsPDF('p','pt',image["size"]);
    pdf.addImage(image["imageData"],'JPEG',0,0,image["size"][0],image["size"][1]);

    return new Promise(resolve=>{
        resolve(pdf);
    })
}

/**
 * 
 * @param {jsPdf object} pdf jsPdf对象
 * @param {string} path 图片地址
 * @returns 
 */
let addImgToPdf = async function(pdf,path){
    let image = await readImg(path);
    // var pdf = new jsPDF('p','pt',image["size"]);
    pdf.addPage(image["size"], 'p');
    pdf.addImage(image["imageData"],'JPEG',0,0,image["size"][0],image["size"][1]);

    return new Promise(resolve=>{
        resolve(pdf);
    })
}
/**
 * 
 * @param {string} path 目录路径
 * @returns 目录下所有图片的文件名
 */
 function readDir(path){
     return new Promise((resolve, reject)=>{
         fs.readdir(path,"utf-8",(err,files)=>{
             if(!err){
                 resolve(files);
             }else{
                 reject(err)
             }
             
         })
     })
 }
 
/**
 * 
 * @param {string} dirPath 目录路径
 * @param {string} fileName 要保存的文件名
 */
 async function genPdfFromDir(dirPath, fileName){
     // let dirPath = "./img/"
     let pdf;
     let filesPath = await readDir(dirPath);

     if (filesPath.length == 0){
         throw new Error("该目录下没有图片" + dirPath);
     }

     console.log("正在为您生成pdf文件,请稍等...");
     for (let i =0;i < filesPath.length;i++){
         let absPath = dirPath + filesPath[i];
         // doc.addPage([2016,2984], 'p');
         
         if (i==0){
             pdf = await addFirstPage(absPath);
             
         }else{
             pdf = await addImgToPdf(pdf,absPath);
         }
        //  let size = await addSingeImgToPdf(absPath,doc);
        //  if (i != filesPath.length -1 ){
        //      pdf.addPage([size[0],size[1]], 'p');
        //  }
         
     }
     fileName = fileName || 'out.pdf'
     pdf.save(fileName);
     console.log("文件生成功！\n文件名为:"+fileName);
     
 }
 
 let dirPath = "./img/"
 genPdfFromDir(dirPath);
 
 // 单例模式
 /**
  * 根据URL获取图片生成pdf
  * @param {string} baseUrl root url 
  */
 function genPdfFromUrl(baseUrl){
     //获取图片-->迭代
 
     //添加图片到pdf
 }