const vscode = require('vscode')
const {
  getSetting
} = require("../src/helpers")

describe("Helpers", () => {
  beforeEach(() => {
    vscode.workspace.getConfiguration = jest.fn().mockReturnValue({
      get: jest.fn()
    })
  })


  it("passes languageId of active editor when getting settings", () => {
    vscode.window.activeTextEditor = {
      document: {
        languageId: 'test-language'
      }
    }

    getSetting("test")

    expect(vscode.workspace.getConfiguration).toHaveBeenCalledWith("justTesting", {
      "languageId": "test-language"
    })
  });


  it("does not crash when there is no activeTextEditor", () => {
    vscode.window.activeTextEditor = undefined

    getSetting("test")

    expect(vscode.workspace.getConfiguration).toHaveBeenCalledWith("justTesting", {
      "languageId": undefined
    })
  })

})
