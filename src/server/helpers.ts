import util from 'util';

export function inspect(obj)
{
  return util.inspect(obj, {
    showHidden: false,
    depth: null,
    colors: true
  });
}