import React, { useCallback, useState } from "react";
import { Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

const DEFAULT_TITLE = "Click to Upload (.torrent)";

export default function UploadTorrentFile({ onChange }) {
  const onBeforeUpload = useCallback((file) => {
    // do not upload yet but at submit
    return false;
  }, []);
  const [state, setState] = useState({ title: DEFAULT_TITLE });
  const handleChange = useCallback(
    ({ file }) => {
      onChange(file.path);
      setState({
        ...state,
        title: file.name || DEFAULT_TITLE,
      });
    },
    [onChange, state]
  );
  return (
    <Upload
      beforeUpload={onBeforeUpload}
      multiple={false}
      onChange={handleChange}
      showUploadList={false}
    >
      <Button icon={<UploadOutlined />} id="upload-button">
        {state.title}
      </Button>
    </Upload>
  );
}

UploadTorrentFile.propTypes = {
  onChange: PropTypes.func,
};

UploadTorrentFile.defaultProps = {
  onChange: () => {},
};
