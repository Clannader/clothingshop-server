/**
 * [getFileType 下载文档对应的类型]
 * @param  {[type]} type [description]
 * @param  {[type]} id   [description]
 * @return {[type]}      [description]
 */
export function getFileType(id) {
  let arr = [
    { type: "doc", application: "application/msword" },
    {
      type: "docx",
      application:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    },
    { type: "dot", application: "application/msword" },
    {
      type: "dotx",
      application:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.template"
    },
    { type: "xls", application: "application/vnd.ms-excel" },
    {
      type: "xlsx",
      application:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    },
    { type: "ppt", application: "application/vnd.ms-powerpoint" },
    {
      type: "pptx",
      application:
          "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    },
    { type: "pdf", application: "application/pdf" },
    { type: "txt", application: "text/plain" },
    { type: "gif", application: "image/gif" },
    { type: "jpeg", application: "image/jpeg" },
    { type: "jpg", application: "image/jpeg" },
    { type: "png", application: "image/png" },
    { type: "css", application: "text/css" },
    { type: "html", application: "text/html" },
    { type: "htm", application: "text/html" },
    { type: "xsl", application: "text/xml" },
    { type: "xml", application: "text/xml" },
    { type: "mpeg", application: "video/mpeg" },
    { type: "mpg", application: "video/mpeg" },
    { type: "avi", application: "video/x-msvideo" },
    { type: "movie", application: "video/x-sgi-movie" },
    { type: "bin", application: "application/octet-stream" },
    { type: "exe", application: "application/octet-stream" },
    { type: "so", application: "application/octet-stream" },
    { type: "dll", application: "application/octet-stream" },
    { type: "ai", application: "application/postscript" },
    { type: "dir", application: "application/x-director" },
    { type: "js", application: "application/x-javascript" },
    { type: "swf", application: "application/x-shockwave-flash" },
    { type: "xhtml", application: "application/xhtml+xml" },
    { type: "xht", application: "application/xhtml+xml" },
    { type: "zip", application: "application/zip" },
    { type: "mid", application: "audio/midi" },
    { type: "midi", application: "audio/midi" },
    { type: "mp3", application: "audio/mpeg" },
    { type: "rm", application: "audio/x-pn-realaudio" },
    { type: "rpm", application: "audio/x-pn-realaudio-plugin" },
    { type: "wav", application: "audio/x-wav" },
    { type: "bmp", application: "image/bmp" }
  ];
  return findArrayReturnValue(arr, "type", id, "application");
}
