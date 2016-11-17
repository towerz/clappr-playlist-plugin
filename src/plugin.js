import {CorePlugin, Events} from 'Clappr'

export default class PlaylistPlugin extends CorePlugin {
  static get version() { return VERSION }
  get name() { return 'playlist' }

  get options() { return this.core.options.playlist || (this.core.options.playlist = {}) }

  get items() { return this.options.sources }

  get currentItem() { return this.items[this.currentIndex] }

  get currentIndex() { return this._currentIndex || (this._currentIndex = 0) }
  set currentIndex(index) {
    if (index >= 0 && index < this.items.length) {
      this._currentIndex = index
    }
  }

  bindEvents() {
    this.listenToOnce(this.core, Events.CORE_CONTAINERS_CREATED, this._containersCreated)
    this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_CONTAINERCHANGED, this._bindContainerEvents)
    this.core.getCurrentContainer() && this._bindContainerEvents()
  }

  loadPlaylistItem(index, autoPlay = false) {
    if (index >= 0 && index < this.items.length) {
      this.currentIndex = index
      var sources = this.currentItem.sources || [this.currentItem.source]
      this.currentItem.autoPlay = autoPlay
      this.core.configure(this.currentItem)
      this.core.load(sources)
    }
  }

  _bindContainerEvents() {
    let container = this.core.getCurrentContainer()
    if (this._container) {
        this.stopListening(this._container)
    }
    this._container = container
    this.listenTo(container, Events.CONTAINER_ENDED, this._ended)
  }

  _containersCreated() {
    if (this.options.sources) {
      this.loadPlaylistItem(0)
    }
  }

  _ended() {
    if (this.currentIndex < this.items.length - 1) {
      this.currentIndex += 1
      this.loadPlaylistItem(this.currentIndex, true)
    }
  }

}
