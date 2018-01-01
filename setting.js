
module.exports = function(location){

  var result = {};

  result.buildTargets = [
    ``,
    `boxes/`,
    `particle_normal/`,
    `particle_text/`,
    `planeGeometry/`,
    `webfont/`,
  ];


  result.settingLocal = {
    "title": "local",
    "path": "/" 
  };

  result.settingDev = {
    "title": "dev",
    "path": "/" 
  };
  
  result.settingRelease = {
    "title": "release",
    "path": "/"  
  };

  return result;
}