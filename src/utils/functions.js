import util from 'util';

export function print(object) {
        util.inspect(object, false, 12, true)
}
