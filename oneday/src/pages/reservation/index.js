import React, { useCallback, useEffect, useState } from "react";
import { Redirect } from "react-router";
import TextField from "@mui/material/TextField";
import { useSelector } from "react-redux";
import axios from "axios";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

import {
  Container,
  Header,
  ProductInfoHeader,
  ProductInfo,
  UserInfo,
  Buttons,
} from "./styles";

const Reservation = (props) => {
  const auth = useSelector((state) => state.auth);

  const [productData, setProductData] = useState(
    props.location.state.productData
  );
  const [schedule, setSchedule] = useState(props.location.state.schedule);
  const [personnel, setPersonnel] = useState(props.location.state.personnel);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    requestUserData();
  }, []);

  const requestUserData = useCallback(async () => {
    try {
      const response = await axios.get("/api/auth/user", {
        headers: { token: auth.token },
      });
      setName(response.data.name);
      setPhone(response.data.phone);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const requestCreateReservation = useCallback(async () => {
    try {
      const response = await axios.post(
        "/api/reservation",
        {
          name,
          phone,
          personnel,
          productId: productData.id,
          sellerId: productData.sellerId,
          scheduleId: schedule.id,
        },
        {
          headers: {
            token: auth.token,
          },
        }
      );
      if (response.status === 200) setOpen(true);
    } catch (error) {
      console.log(error);
    }
  }, [productData, schedule, personnel, name, phone]);

  const handleClose = useCallback(() => {
    setOpen(false);
    props.history.replace("/");
  }, []);

  if (auth.type !== 1) {
    return <Redirect to="/" />;
  }

  return Object.keys(productData).length === 0 ? null : (
    <Container>
      <Snackbar
        open={open}
        autoHideDuration={1000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          ?????????????????????
        </Alert>
      </Snackbar>
      <Header>?????? / ??????</Header>
      <Header>????????? ??????</Header>
      <ProductInfoHeader>
        <div>????????? ??????</div>
        <div>?????? ??????</div>
        <div>?????? ??????</div>
        <div>?????????</div>
      </ProductInfoHeader>
      <ProductInfo>
        <div className="product_info">
          <img
            src={productData.img.replace(/\\/gi, "/").replace(/public/gi, "")}
          />
          <div>
            <div>{productData.seller.company}</div>
            <div>
              [{productData.category}] {productData.name}
            </div>
          </div>
        </div>
        <div>{productData.name}</div>
        <div>{personnel} ???</div>
        <div>{productData.price * personnel} ???</div>
      </ProductInfo>
      <Header>????????? ??????</Header>
      <UserInfo>
        <div>
          <div>??????</div>
          <div>?????????</div>
        </div>
        <div>
          <TextField
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            variant="outlined"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </UserInfo>
      <Buttons>
        <Button variant="contained" onClick={requestCreateReservation}>
          ??????
        </Button>
        <Button variant="outlined" onClick={() => props.history.goBack()}>
          ??????
        </Button>
      </Buttons>
    </Container>
  );
};

export default Reservation;
