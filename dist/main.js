(()=>{"use strict";const e=e=>(new DOMParser).parseFromString(e,"text/html"),t=(e,t,n)=>fetch(e,t||{}).then((e=>e[n]())),n=(e,n)=>t(e,n,"json"),r=(e,n)=>t(e,n,"text"),a=(e,n)=>t(e,n,"arrayBuffer"),l=e=>{let t="",n=new Uint8Array(e),r=n.byteLength;for(let e=0;e<r;e++)t+=String.fromCharCode(n[e]);return window.btoa(t)},o=(e,t,n,r)=>{let a=("a",o={href:"data:"+n+";base64,"+l(r),download:e+"."+t},((e,t)=>{for(let n in t)e.setAttribute(n,t[n]);return e})(document.createElement("a"),{...o}));var o;return a.click(),a};async function i(t,n){let l=await async function(t,n){let a=(l=await r(t),Array.from(e(l).scripts).filter((e=>e.textContent.match(/googlevideo\.com\/videoplayback/)))[0]).textContent;var l;a=a.substring(a.indexOf("{"),a.lastIndexOf("}")),a=JSON.parse(a+"}"),console.log(a);const{formats:o}=a.streamingData,{author:i,videoId:u,title:s}=a.videoDetails;let m=o.filter((e=>e.mimeType.indexOf("video")>-1)),c=o.filter((e=>e.mimeType.indexOf("audio")>-1)),p=[],_=[],f=e=>{let{bitrate:t,height:n,contentLength:r,url:a,mimeType:l,audioQuality:o}=e;if(t)return l=l.split(";")[0],{url:a+"&bitrate="+t,quality:n||o,contentLength:r,mimeType:l,author:i,videoId:u,title:s};if(l){let e=l.match(/(")([^"]*)(?=")/g).toString().replace(/^"/,"");return console.log(" codecs: ",e,"mimeType: ",l),l=l.split(";")[0],{url:a+"&codecs="+e,quality:n||o,contentLength:r,mimeType:l,author:i,videoId:u,title:s}}};for(let e of m)p.push(f(e));for(let e of c)_.push(f(e));let h=p.filter((e=>1080===e.quality))[0],d=p.filter((e=>720===e.quality))[0],g=p.filter((e=>480===e.quality))[0],y=p.filter((e=>360===e.quality))[0],x=p.filter((e=>240===e.quality))[0],w=p.filter((e=>144===e.quality))[0],b=p.reduce(((e,t,n)=>p[n].quality===Math.max(e.quality,t.quality)?p[n]:null)),O={audio:_,video:p,HQ:b,_1080:h,_720:d,_480:g,_360:y,_240:x,_144:w};return console.log(O),O}(t),i=l.HQ,u=i.mimeType.split("/");u=u[u.length-1],l=await a(i.url),o(n||i.title,u,i.mimeType,l)}const u={enrollments:"https://programs.edraak.org/en/api/enrollments/?is_completed=false",learnURL:"https://programs.edraak.org/en/learn/",specializations:(e,t,n)=>`https://programs.edraak.org/en/api/specializations/${e}/component/${t}?states_program_id=${n}`,course:(e,t)=>`https://programs.edraak.org/en/api/component/${e}/?states_program_id=${t}`},s=t=>{var n;return(n=t,Array.from(e(n).scripts).filter((e=>e.textContent.match(/var context/)))[0]).textContent.match(/[0-9a-fA-F]{24}/g)[0]};function m(e){return r(u.learnURL+e.slug).then((t=>{let n=s(t);return[{...e},n]})).then((e=>{const[t,r]=e;return n(u.course(r,t.id)).then((e=>[t,{...e},r]))}))}function c(e,t){let{name:n}=e,r=[];console.log(t,"programDataprogramData");for(let a of t.children)if(a.children)for(let t of a.children)if(t.external_url?r.push({url:t.external_url,title:n?n+" - "+t.title:t.title,course:e.name_ar&&e.name_en?e.name_ar+" - "+e.name_en:e.name}):t.youtube_url?r.push({url:t.youtube_url,title:n?n+" - "+t.title:t.title,course:e.name_ar&&e.name_en?e.name_ar+" - "+e.name_en:e.name}):t.component_type.indexOf("FileResource")>-1&&r.push({url:t.url,title:n?n+" - "+t.title:t.title,course:e.name_ar&&e.name_en?e.name_ar+" - "+e.name_en:e.name}),t.children)for(let a of t.children)if(a.external_url?r.push({url:a.external_url,title:n?n+" - "+a.title:a.title,course:e.name_ar&&e.name_en?e.name_ar+" - "+e.name_en:e.name}):a.youtube_url?r.push({url:a.youtube_url,title:n?n+" - "+a.title:a.title,course:e.name_ar&&e.name_en?e.name_ar+" - "+e.name_en:e.name}):a.component_type.indexOf("FileResource")>-1&&r.push({url:a.url,title:n?n+" - "+a.title:a.title,course:e.name_ar&&e.name_en?e.name_ar+" - "+e.name_en:e.name}),a.children)for(let t of a.children)if(console.log(t),t.external_url?r.push({url:t.external_url,title:n?n+" - "+t.title:t.title,course:e.name_ar&&e.name_en?e.name_ar+" - "+e.name_en:e.name}):t.youtube_url?r.push({url:t.youtube_url,title:n?n+" - "+t.title:t.title,course:e.name_ar&&e.name_en?e.name_ar+" - "+e.name_en:e.name}):t.component_type.indexOf("FileResource")>-1&&r.push({url:t.url,title:n?n+" - "+t.title:t.title,course:e.name_ar&&e.name_en?e.name_ar+" - "+e.name_en:e.name}),t.children)for(let a of t.children)console.log(a),a.external_url?r.push({url:a.external_url,title:n?n+" - "+a.title:a.title,course:e.name_ar&&e.name_en?e.name_ar+" - "+e.name_en:e.name}):a.youtube_url?r.push({url:a.youtube_url,title:n?n+" - "+a.title:a.title,course:e.name_ar&&e.name_en?e.name_ar+" - "+e.name_en:e.name}):a.component_type.indexOf("FileResource")>-1&&r.push({url:a.url,title:n?n+" - "+a.title:a.title,course:e.name_ar&&e.name_en?e.name_ar+" - "+e.name_en:e.name});return r}!async function(e){n(u.enrollments).then((async t=>{console.log(t);let n=t.filter((t=>t.program.name_ar.indexOf(e)>-1||t.program.name_en.indexOf(e)>-1));console.log(n,"target target target target"),n=n[0];const{program:a}=n,{slug:l}=a;return r(u.learnURL+l).then((e=>{let t=s(e);return console.log(t,"trackId trackId"),[l,a,t]}))})).then((async([e,t,r])=>{if(console.log("stopped here !",e,t,r),e.indexOf("specialization")>-1){let a=await n(u.specializations(e,r,t.id));return a=a.EdraakCourse,[r,e,{program:t,courses:a}]}if(e.indexOf("course")>-1)return[r,e,{program:t}];throw new Error(`the following slug ${e} isn't supported yet!`)})).then((async([e,t,{program:n,courses:r}])=>{console.log("stopped here ?. please wait...");let a=[];if(r)for(let e of r)a.push(await m(e));else a.push(await m(n));return a})).then((async e=>{let t=[];console.log(e,"coursesList, coursesList");for(let n of e)t.push(...c(n[0],n[1]));return t})).then((async e=>{console.log(e,"links, links"),console.log("download is started please wait ......");for(let t=0;t<e.length;t++){let{url:n,title:r,course:a}=e[t],l=t+1;r=l+" "+r;let u=n.split(".");if(u=u[u.length-1],console.log("downloading please wait ......"),n.indexOf("youtube")>-1){await i(n,r),console.log(r,a,"finished: "+l+" of "+e.length+"......");continue}n=await fetch(n);let s=n.headers.get("content-type");n=await n.arrayBuffer(),o(r,u,s,n),console.log(r,a,"finished: "+l+" of "+e.length+"......")}})).catch((e=>console.log(e)))}("Mastering Excel")})();