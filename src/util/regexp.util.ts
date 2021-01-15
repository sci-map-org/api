export const urlRegexp = /^(https?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm;

//TODO:improve as it doesn't check the domain
export const youtubeVideoRegexp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/; //outputs videoId in match[1]

export const youtubePlaylistRegexp = /.*youtube.com\/playlist\?list=([^#\&\?]*).*/; //outputs videoId in match[1]
// /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|playlist\?list=)([^#\&\?]*).*/; => doesn't check domain and don't know the url structure for embed / youtu.be
