const makeExtensionContext = () => (
  {
    workspaceState: {
      _data: new Map(),
      update (key, value) {
        this._data.set(key, value)
      },
      get (key) {
        return this._data.get(key)
      }
    }
  }
)

module.exports = { makeExtensionContext }
