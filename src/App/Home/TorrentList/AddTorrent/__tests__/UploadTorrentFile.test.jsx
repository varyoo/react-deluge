/**
 * https://github.com/kentcdodds/react-testing-library-examples/blob/master/src/__tests__/upload-file.js
 */
import React from "react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import rootReducer from "../../../../../rootReducer";
import UploadTorrentFile from "../UploadTorrentFile";

function getFile(basename) {
  const file = new File(["(⌐□_□)"], basename, {
    type: "image/png",
  });
  file.path = "/path/to/" + basename;
  return file;
}

describe("file uploads", () => {
  let container, getByText;
  let handleChange;
  beforeEach(() => {
    const store = createStore(rootReducer);
    handleChange = jest.fn();
    ({ container, getByText } = render(
      <Provider store={store}>
        <UploadTorrentFile onChange={handleChange} />
      </Provider>
    ));
  });

  test("upload single file", () => {
    const file = getFile("chucknorris.png");
    const inputEl = container.querySelector("input[type=file]");
    userEvent.upload(inputEl, file);

    getByText("chucknorris.png");
    expect(handleChange).toHaveBeenCalledWith("/path/to/chucknorris.png");
  });

  test("replace previous file on new upload", () => {
    let inputEl = container.querySelector("input[type=file]");
    const firstFile = getFile("chucknorris.png");
    userEvent.upload(inputEl, firstFile);
    getByText("chucknorris.png");

    inputEl = container.querySelector("input[type=file]");
    const latestFile = getFile("latestFile.png");
    userEvent.upload(inputEl, latestFile);
    getByText("latestFile.png");

    expect(handleChange).toHaveBeenNthCalledWith(1, "/path/to/chucknorris.png");
    expect(handleChange).toHaveBeenNthCalledWith(2, "/path/to/latestFile.png");
  });
});
