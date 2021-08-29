import { transformSync } from '@babel/core'
import { autoTrackPlugin } from '../src'

describe('auto track', () => {
  it('should insert track method', () => {
    const input = `
import aa from 'aa';
import * as bb from 'bb';
import {cc} from 'cc';
import 'dd';

function a () {
    console.log('aaa');
}

class B {
    bb() {
        return 'bbb';
    }
}

const c = () => 'ccc';

const d = function () {
    console.log('ddd');
}
`

    const result = transformSync(input, {
      plugins: [autoTrackPlugin, [autoTrackPlugin, {}, 'unique']],
    })

    expect(result).toMatchSnapshot()
  })
})
