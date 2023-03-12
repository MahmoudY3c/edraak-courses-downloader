import { parser, reqText, reqBuff, downloadByteArray } from './common.js'

export async function ytDownloadLinks(url, filename) {
  let ytHTML = await reqText(url)
  //search for script contains video download links
  const getYtInitialPlayerResponse = doc => Array.from(
    parser(doc).scripts
  ).filter(e => e.textContent.match(/googlevideo\.com\/videoplayback/))[0];
  //get the script text
  let ytInitialPlayerResponse = getYtInitialPlayerResponse(ytHTML).textContent
  //extract the object
  ytInitialPlayerResponse = ytInitialPlayerResponse.substring(
    ytInitialPlayerResponse.indexOf("{"),
    ytInitialPlayerResponse.lastIndexOf("}")
  )
  //add missing } from the index
  ytInitialPlayerResponse = JSON.parse(ytInitialPlayerResponse + "}")
  console.log(ytInitialPlayerResponse)
  //start extracting the video download urls
  /**
   * @Tip {i should to use {adaptiveFormats} instaed of {formats} only but the problem that the video links comes without sound try to fix that later}
   */
  const {formats } = ytInitialPlayerResponse.streamingData
  const {author, videoId, title} = ytInitialPlayerResponse.videoDetails

  //filter to get video link
  let video = formats.filter(e => e.mimeType.indexOf("video") > -1)
  //filter to get audio link
  let audio = formats.filter(e => e.mimeType.indexOf("audio") > -1)
  //extract download links
  let videoDownloadLinks = [], audioDownloadLinks = []
  /**
   * a function to extract required data
   * @param {*} object = data object
   * @returns {...data} = object of required data
   */
  let dataExtractor = (object) => {
    let {bitrate, height, contentLength, url, mimeType, audioQuality} = object
    if(bitrate) {
      //get media mimeType only
      mimeType = mimeType.split(";")[0]
      return {
        url: url + "&bitrate=" + bitrate,
        quality: height ? height : audioQuality,
        contentLength,
        mimeType,
        //use varibles at the top
        author, videoId, title
      }
    } else if(mimeType/* .contains("codec") */) {
      //extract codecs from mimeType {String}
      let codecs = mimeType
        .match(/(")([^"]*)(?=")/g)
        .toString()
        .replace(/^"/, '')
      //   .split(',')
      // codecs = codecs[0]
      //get media mimeType only
      console.log(' codecs: ', codecs, "mimeType: ", mimeType)
      mimeType = mimeType.split(";")[0]
      return {
        url: url + "&codecs=" + codecs,
        quality: height ? height : audioQuality,
        contentLength,
        mimeType,
        //use varibles at the top
        author, videoId, title
      }
    }
  }
  //video data
  for(let i of video) {
    videoDownloadLinks.push(dataExtractor(i))
  }
  //audio data
  for(let i of audio) {
    audioDownloadLinks.push(dataExtractor(i))
  }
  let _1080 = videoDownloadLinks.filter(e => e.quality === 1080)[0]
  let _720 = videoDownloadLinks.filter(e => e.quality === 720)[0]
  let _480 = videoDownloadLinks.filter(e => e.quality === 480)[0]
  let _360 = videoDownloadLinks.filter(e => e.quality === 360)[0]
  let _240 = videoDownloadLinks.filter(e => e.quality === 240)[0]
  let _144 = videoDownloadLinks.filter(e => e.quality === 144)[0]
  //get the object contains the high qulaity
  let HQ = videoDownloadLinks.reduce((total, curr, i) => videoDownloadLinks[i].quality === Math.max(total.quality, curr.quality) ? videoDownloadLinks[i] : null)
  // let webm = videoDownloadLinks.filter((e, i) => e.indexOf("webm") > -1)
  let data = {
    audio: audioDownloadLinks,
    video: videoDownloadLinks,
    HQ,
    // webm,
    _1080, _720, _480, _360, _240, _144
  }
  console.log(data)
  // await download(data)
  //handle codecs, bitrate
  return data
}
// ytDownloadLinks("https://www.youtube.com/watch?v=6bkPS37-c6A")

/**
 * @param {youtube video link} url 
 * @param {optional fileName to set your custom name} fileName 
 */
export async function ytDownloader(url, fileName) {
  //get the video data
  let data = await ytDownloadLinks(url)
  //choose first {HQ}
  let video = data.HQ
  let ext = video.mimeType.split("/")
  ext = ext[ext.length-1]
  data = await reqBuff(video.url)
  downloadByteArray(fileName ? fileName : video.title, ext, video.mimeType, data)
}