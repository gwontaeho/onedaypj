import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DaumPostcode from "react-daum-postcode";
import { useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import AddIcon from "@mui/icons-material/Add";
import ButtonGroup from "@mui/material/ButtonGroup";

import {
  Container,
  Header,
  Buttons,
  Infos,
  Img,
  Info,
  Address,
  Details,
  ModalBox,
} from "./styles";
import axios from "axios";

const SellerProductUpdate = (props) => {
  const auth = useSelector((state) => state.auth);

  const [open, setOpen] = useState(false);

  const [productData, setProductData] = useState([]);

  const [img, setImg] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState("");
  const [shortAddress, setShortAddress] = useState("");
  const [address, setAddress] = useState("");
  const [extraAd, setExtraAd] = useState("");
  const [detail, setDetail] = useState([]);

  const [imgCheck, setImgCheck] = useState(false);
  const [addressType, setAddressType] = useState(0);

  useEffect(() => {
    console.log(props);
    requestProductData();
  }, []);

  const requestProductData = useCallback(async () => {
    try {
      const response = await axios.get(
        `/api/product/seller/${props.match.params.id}`,
        { headers: { token: auth.token } }
      );
      setProductData(response.data);
      setName(response.data.name);
      setPrice(response.data.price);
      setTime(response.data.time);
      setCategory(response.data.category);
      setDetail(JSON.parse(response.data.detail));
    } catch (error) {
      console.log(error);
    }
  }, []);

  const onclickRemove = useCallback((e) => {
    e.target.parentNode.parentNode.remove();
  }, []);

  const onClickAdd = useCallback(() => {
    const detail = document.getElementsByClassName("detail");
    if (detail.length === 5) return;
    const details = document.getElementsByClassName("details")[0];
    const newDiv = document.createElement("div");
    const header = document.createElement("div");
    const newInput = document.createElement("input");
    const removeButton = document.createElement("div");
    const newTextarea = document.createElement("textarea");
    newDiv.className = "detail";
    header.className = "header";
    newInput.className = "detailTitle";
    removeButton.className = "removeButton";
    removeButton.innerHTML = "??????";
    removeButton.addEventListener("click", onclickRemove);
    newTextarea.className = "detailText";
    header.appendChild(newInput);
    header.appendChild(removeButton);
    newDiv.appendChild(header);
    newDiv.appendChild(newTextarea);
    details.appendChild(newDiv);
  }, []);

  const requestUpdateProduct = useCallback(async () => {
    let stringary = [];
    const details = document.getElementsByClassName("detail");
    [...details].forEach((v) => {
      let stringobj = {};
      stringobj["title"] = v.childNodes[0].childNodes[0].value;
      stringobj["text"] = v.childNodes[1].value;
      stringary.push(stringobj);
    });

    const formData = new FormData();
    formData.append("productId", productData.id);
    formData.append("imgCheck", imgCheck);
    formData.append("img", img);
    formData.append("originalImg", productData.img);
    formData.append("name", name);
    formData.append("price", price);
    formData.append("time", time);
    if (addressType === 0) {
      formData.append("address", productData.address);
    } else if (addressType === 1) {
      formData.append("address", props.sellerData.address);
    } else if (addressType === 2) {
      formData.append("address", shortAddress + "&" + address + "&" + extraAd);
    }
    formData.append("detail", JSON.stringify(stringary));

    try {
      const response = await axios.put("/api/product/update", formData, {
        headers: {
          token: auth.token,
        },
      });
      props.history.replace(`/info/product/${productData.id}`);
    } catch (error) {
      console.log(error);
    }
  }, [
    productData,
    img,
    name,
    price,
    time,
    shortAddress,
    address,
    extraAd,
    addressType,
    imgCheck,
  ]);

  const handleComplete = useCallback((data) => {
    let short = data.sigungu + " " + data.bname;
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    setShortAddress(short);
    setAddress(fullAddress);
    setOpen(false);
  }, []);

  const detailList = detail.map((v) => {
    return (
      <div className="detail">
        <div className="header">
          <input className="detailTitle" defaultValue={v.title} />
          <div className="removeButton" onClick={onclickRemove}>
            ??????
          </div>
        </div>
        <textarea className="detailText" defaultValue={v.text} />
      </div>
    );
  });

  return Object.keys(productData).length === 0 ? null : (
    <Container>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <Box sx={ModalBox}>
          <DaumPostcode onComplete={handleComplete} />
        </Box>
      </Modal>
      <Header>????????? ??????</Header>
      <Buttons>
        <Button variant="contained" onClick={requestUpdateProduct}>
          ??????
        </Button>
        <Button variant="outlined">??????</Button>
      </Buttons>

      <Infos>
        <Img>
          <div className="title">????????? ????????????</div>
          <img
            src={
              !imgCheck
                ? productData.img.replace(/\\/gi, "/").replace(/public/gi, "")
                : URL.createObjectURL(img)
            }
          />
          <label htmlFor="icon-button-file">
            <input
              accept="image/*"
              id="icon-button-file"
              type="file"
              onChange={(e) => {
                setImgCheck(true);
                setImg(e.target.files[0]);
              }}
            />
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="span"
            >
              <PhotoCamera />
            </IconButton>
          </label>
          {imgCheck ? (
            <div className="button_img_back">
              <IconButton
                color="primary"
                component="span"
                onClick={() => {
                  setImgCheck(false);
                  setImg(props.sellerData.img);
                }}
              >
                <SettingsBackupRestoreIcon />
              </IconButton>
            </div>
          ) : null}
        </Img>

        <Info>
          <div className="title">????????? ??????</div>
          <TextField
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Info>

        <Info>
          <div className="title">????????? (???)</div>
          <TextField
            variant="outlined"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </Info>

        <Info>
          <div className="title">???????????? (???)</div>
          <TextField
            variant="outlined"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </Info>

        <Info>
          <div className="title">????????????</div>
          <FormControl>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value="?????????">?????????</MenuItem>
              <MenuItem value="??????">??????</MenuItem>
              <MenuItem value="??????">??????</MenuItem>
              <MenuItem value="?????????">?????????</MenuItem>
              <MenuItem value="????????????">????????????</MenuItem>
              <MenuItem value="??????">??????</MenuItem>
            </Select>
          </FormControl>
        </Info>

        <Address>
          <div className="title">??????</div>
          <div>
            <div className="type">
              <ButtonGroup>
                <Button
                  variant={addressType === 0 ? "contained" : "outlined"}
                  onClick={() => setAddressType(0)}
                >
                  ?????? ??????
                </Button>
                <Button
                  variant={addressType === 1 ? "contained" : "outlined"}
                  onClick={() => setAddressType(1)}
                >
                  ????????? ?????? ??????
                </Button>
                <Button
                  variant={addressType === 2 ? "contained" : "outlined"}
                  onClick={() => setAddressType(2)}
                >
                  ?????? ??????
                </Button>
              </ButtonGroup>
            </div>
            {addressType === 2 ? (
              <div className="type">
                <TextField
                  variant="outlined"
                  value={address}
                  InputProps={{
                    readOnly: true,
                  }}
                  onClick={() => setOpen(true)}
                />
                <TextField
                  variant="outlined"
                  error={extraAd === "" ? true : false}
                  value={extraAd}
                  onChange={(e) => setExtraAd(e.target.value)}
                />
              </div>
            ) : null}
          </div>
        </Address>
      </Infos>
      <Details>
        <div className="title">
          <div>????????????</div>
          <Button variant="outlined" endIcon={<AddIcon />} onClick={onClickAdd}>
            ?????? ??????
          </Button>
        </div>
        <div className="details">{detailList}</div>
      </Details>
    </Container>
  );
};

export default SellerProductUpdate;
