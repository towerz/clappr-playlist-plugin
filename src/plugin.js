import {UICorePlugin} from 'Clappr'

export default class PlaylistPlugin extends UICorePlugin {
  static get version() { return VERSION }
  get name() { return 'playlist' }
}
