import config from '../../config';

export default (...ident) => {
  return config.build.output + '/' + ident.join('-') + '-' + ((new Date()).getTime()) + '.json';
};
