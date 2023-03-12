import { ytDownloader } from './youtubeDownloader';

import {
  reqJSON,
  reqText,
  arrayBufferToBase64,
  downloadByteArray,
} from './common.js'

import {
  getTrackId,
  getProgramData,
  extractProgramData
} from "./handlers.js"

import {urls} from './handlers.js'
//some reuests handlers
async function downloadOne(courseName) {
  //get enrollments list
  reqJSON(urls.enrollments)
    //get trackId
    .then(async (e) => {
      //filter response to get the course by name + course id
      console.log(e)
      let target = e.filter(el => el.program.name_ar.indexOf(courseName) > -1 || el.program.name_en.indexOf(courseName) > -1)
        console.log(target, 'target target target target')
        target = target[0]
      // let target = e[27]
      const { program } = target, { slug } = program
      //get course id to use it in the next request
      return reqText(urls.learnURL + slug)
        .then(html => {
          let trackId = getTrackId(html)
          console.log(trackId, 'trackId trackId')
          return [slug, program, trackId]
        })
    })
    //support specializations
    //check if the slug is specialization or course and if specialization do some extra steps
    .then(async ([slug, program, trackId]) => {
      console.log("stopped here !", slug, program, trackId)
      //if it's specialization search for specialization courses 
      //else return the program that it's a single course return the course 
      //else throw error that this slug in't supported
      if (slug.indexOf('specialization') > -1) {
        //get specializations courses list
        let courses = await reqJSON(urls.specializations(slug, trackId, program.id))
        //get courses array
        courses = courses.EdraakCourse
        // console.log(courses)
        return [trackId, slug, { program, courses }]
      } else if (trackId, slug.indexOf('course') > -1) {
        return [trackId, slug, { program }]
      } else {
        throw new Error(`the following slug ${slug} isn't supported yet!`)
      }
    })
    //get the course full object to extract it's data
    .then(async ([trackId, slug, { program, courses }]) => {
      console.log("stopped here ?. please wait...")
      let coursesList = []
      //check if it's a single course or courses
      if (courses) {
        for (let i of courses) coursesList.push(await getProgramData(i))
      } else {
        coursesList.push(await getProgramData(program))
      }
      return coursesList
    })
    //extract videos + pdf from the target course or specialization
    .then(async coursesList => {
      //[program, { ...programData }, trackId]
      let programDataURLS = []
      console.log(coursesList, 'coursesList, coursesList')
      for (let course of coursesList) {
        programDataURLS.push(...extractProgramData(course[0], course[1]))
      }
      return programDataURLS
    })
    //start downloading the files
    .then(async links => {
      console.log(links, 'links, links')
      console.log("download is started please wait ......")
      //start download the links
      for (let i = 0; i < links.length; i++) {
        let { url, title, course } = links[i];
        //counter
        let n = i + 1
        //add number before the file name to sort files by name
        title = n + ' ' + title

        let urlExtention = url.split(".");
        urlExtention = urlExtention[urlExtention.length - 1]
        console.log("downloading please wait ......")
        //handle downloading from youtube
        if(url.indexOf("youtube") > -1) {
          let data = await ytDownloader(url, title)
          console.log(title, course, "finished: " + n + " of " + links.length + "......")
          continue;
        }
        url = await fetch(url);
        //getting url type + buffer array
        let urlType = url.headers.get("content-type")
        // console.log(urlType, urlExtention, "urlType, urlExtention")
        url = await url.arrayBuffer();
        //start download
        downloadByteArray(title, urlExtention, urlType, url)
        console.log(title, course, "finished: " + n + " of " + links.length + "......")
      }
    })
    .catch(Err => console.log(Err))

}
downloadOne("Mastering Excel")