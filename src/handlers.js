
import {reqText, reqJSON, parser} from './common.js'
//edraak urls
export const urls = {
  enrollments: "https://programs.edraak.org/en/api/enrollments/?is_completed=false",
  learnURL: 'https://programs.edraak.org/en/learn/',
  specializations: (slug, trackId, programId) => `https://programs.edraak.org/en/api/specializations/${slug}/component/${trackId}?states_program_id=${programId}`,
  course: (trackId, programId) => `https://programs.edraak.org/en/api/component/${trackId}/?states_program_id=${programId}`
}
//convert html text to dom object + filter to get the script contains {var context}
export const getContext = doc => Array.from(parser(doc).scripts).filter(e => e.textContent.match(/var context/))[0]
export const extractMongoId = str => str.match(/[0-9a-fA-F]{24}/g)[0]

export const getTrackId = (html) => {
  //get the script contains context var
  let context = getContext(html)
  //extract course mongo id
  let trackId = extractMongoId(context.textContent)
  return trackId
}
//get program course object to extract the course fields from
export function getProgramData(program) {
  return reqText(urls.learnURL + program.slug)
    .then(html => {
      let trackId = getTrackId(html)
      return [{ ...program }, trackId]
    })
    //next step use the track id to get the data
    .then(d => {
      const [program, trackId] = d
      // console.log(program, trackId)
      return reqJSON(urls.course(trackId, program.id))
        .then(programData => [program, { ...programData }, trackId])
    })
}
//a stupid function to loop in 5 levels to get all the course video + pdf link
/**
 * 
 * @param {the main program} program 
 * @param {the program contains courses as children} programData 
 * @returns 
 */
export function extractProgramData(program, programData) {
  let {name} = program
  let dataUrls = []
  //programData consist of 3 children levels 
  //1. the programs direct children {units}
  //2. the children of program children {subjects}
  //3. the children of program subject {grand children} that's the target => contains the {external_url, youtube_url}
  //about the second, third step above a should to check if the subject is already have children or not because that's maye some instructions from the webssite
  //the target here is grand children
  //in the next step we will ran into 5 level loop one for {units}, second for {subjects}, third for {grand children}, fourth for {grand data}, fifth is just for make sure that there's no other data is missing
  console.log(programData, 'programDataprogramData');
  for (let units of programData.children) {
    if (units.children) {
      for (let subjects of units.children) {
        //console.log(subjectChildren)
        if (subjects.external_url) dataUrls.push({
          url: subjects.external_url,
          title: name ? name + ' - ' + subjects.title : subjects.title,
          course: (program.name_ar && program.name_en) ? program.name_ar + ' - ' + program.name_en : program.name
        })
        else if (subjects.youtube_url) dataUrls.push({
          url: subjects.youtube_url,
          title: name ? name + ' - ' + subjects.title : subjects.title,
          course: (program.name_ar && program.name_en) ? program.name_ar + ' - ' + program.name_en : program.name
        })
        //find pdf files
        else if (subjects.component_type.indexOf("FileResource") > -1) dataUrls.push({
          url: subjects.url,
          title: name ? name + ' - ' + subjects.title : subjects.title,
          course: (program.name_ar && program.name_en) ? program.name_ar + ' - ' + program.name_en : program.name
        })
        if (subjects.children) {
          for (let subjectChildren of subjects.children) {
            //console.log(subjectChildren)
            if (subjectChildren.external_url) dataUrls.push({
              url: subjectChildren.external_url,
              title: name ? name + ' - ' + subjectChildren.title : subjectChildren.title,
              course: (program.name_ar && program.name_en) ? program.name_ar + ' - ' + program.name_en : program.name
            })
            else if (subjectChildren.youtube_url) dataUrls.push({
              url: subjectChildren.youtube_url,
              title: name ? name + ' - ' + subjectChildren.title : subjectChildren.title,
              course: (program.name_ar && program.name_en) ? program.name_ar + ' - ' + program.name_en : program.name
            })
            //find pdf files
            else if (subjectChildren.component_type.indexOf("FileResource") > -1) dataUrls.push({
              url: subjectChildren.url,
              title: name ? name + ' - ' + subjectChildren.title : subjectChildren.title,
              course: (program.name_ar && program.name_en) ? program.name_ar + ' - ' + program.name_en : program.name
            })

            if (subjectChildren.children) {
              for (let subjectGrandChildren of subjectChildren.children) {
                console.log(subjectGrandChildren);
                if (subjectGrandChildren.external_url) dataUrls.push({
                  url: subjectGrandChildren.external_url,
                  title: name ? name + ' - ' + subjectGrandChildren.title : subjectGrandChildren.title,
                  course: (program.name_ar && program.name_en) ? program.name_ar + ' - ' + program.name_en : program.name
                })
                else if (subjectGrandChildren.youtube_url) dataUrls.push({
                  url: subjectGrandChildren.youtube_url,
                  title: name ? name + ' - ' + subjectGrandChildren.title : subjectGrandChildren.title,
                  course: (program.name_ar && program.name_en) ? program.name_ar + ' - ' + program.name_en : program.name
                })
                //find pdf files
                else if (subjectGrandChildren.component_type.indexOf("FileResource") > -1) dataUrls.push({
                  url: subjectGrandChildren.url,
                  title: name ? name + ' - ' + subjectGrandChildren.title : subjectGrandChildren.title,
                  course: (program.name_ar && program.name_en) ? program.name_ar + ' - ' + program.name_en : program.name
                })

                //another addtional level
                if (subjectGrandChildren.children) {
                  for (let subjectGrandGrandChildren of subjectGrandChildren.children) {
                    console.log(subjectGrandGrandChildren);
                    if (subjectGrandGrandChildren.external_url) dataUrls.push({
                      url: subjectGrandGrandChildren.external_url,
                      title: name ? name + ' - ' + subjectGrandGrandChildren.title : subjectGrandGrandChildren.title,
                      course: (program.name_ar && program.name_en) ? program.name_ar + ' - ' + program.name_en : program.name
                    })
                    else if (subjectGrandGrandChildren.youtube_url) dataUrls.push({
                      url: subjectGrandGrandChildren.youtube_url,
                      title: name ? name + ' - ' + subjectGrandGrandChildren.title : subjectGrandGrandChildren.title,
                      course: (program.name_ar && program.name_en) ? program.name_ar + ' - ' + program.name_en : program.name
                    })
                    //find pdf files
                    else if (subjectGrandGrandChildren.component_type.indexOf("FileResource") > -1) dataUrls.push({
                      url: subjectGrandGrandChildren.url,
                      title: name ? name + ' - ' + subjectGrandGrandChildren.title : subjectGrandGrandChildren.title,
                      course: (program.name_ar && program.name_en) ? program.name_ar + ' - ' + program.name_en : program.name
                    })
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  return dataUrls
}
