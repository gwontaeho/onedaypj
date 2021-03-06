import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import DateRangePicker from "@mui/lab/DateRangePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { Container, Header, Condition, List, Item, QnaHeader } from "./styles";

const UserQna = () => {
  const auth = useSelector((state) => state.auth);

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [state, setState] = useState(2);
  const [checked, setChecked] = useState(false);
  const [value, setValue] = useState([null, null]);

  const [qnaData, setQnaData] = useState({ count: 0, data: [] });

  useEffect(() => {
    requestQnaData();
  }, [state, page]);

  useEffect(() => {
    if (!checked) requestQnaData();
  }, [checked]);

  const requestQnaData = useCallback(async () => {
    try {
      const response = await axios.post(
        "/api/qna/lookup",
        {
          state,
          page,
          value,
          checked,
        },
        { headers: { token: auth.token } }
      );
      setPages(Math.ceil(response.data.count / 5));
      setQnaData(response.data);

      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }, [state, page, value, checked]);

  const qnaList = qnaData.data.map((v) => {
    return (
      <Item key={v.id}>
        <div className="name">{`[${v.product.category}] ${v.product.name}`}</div>
        <div className="text">{v.createdAt.substr(0, 10)}</div>
        {v.state === 0 ? (
          <div></div>
        ) : (
          <div className="text">{v.updatedAt.substr(0, 10)}</div>
        )}
        <div className="text">{v.state === 0 ? "??? ??????" : "?????? ??????"}</div>
        <div className="text">
          <Link to={`/info/qna/${v.id}`}>?????????</Link>
        </div>
      </Item>
    );
  });

  return (
    <Container>
      <Header>?????? ??????</Header>
      <Condition>
        <div>
          <div>{qnaData.count}???</div>
          <FormControl>
            <Select value={state} onChange={(e) => setState(e.target.value)}>
              <MenuItem value={2}>??????</MenuItem>
              <MenuItem value={1}>????????????</MenuItem>
              <MenuItem value={0}>?????????</MenuItem>
            </Select>
          </FormControl>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                />
              }
              label="?????? ??????"
              labelPlacement="start"
            />
          </FormGroup>
          {checked ? (
            <>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateRangePicker
                  startText=""
                  endText=""
                  value={value}
                  onChange={(newValue) => {
                    setValue(newValue);
                  }}
                  renderInput={(startProps, endProps) => (
                    <React.Fragment>
                      <TextField {...startProps} />
                      <Box sx={{ mx: 1 }} />
                      <TextField {...endProps} />
                    </React.Fragment>
                  )}
                />
              </LocalizationProvider>
              <Button variant="outlined" onClick={requestQnaData}>
                ??????
              </Button>
            </>
          ) : null}
        </div>
        <Pagination page={page} count={pages} onChange={(e, v) => setPage(v)} />
      </Condition>
      <QnaHeader>
        <div>????????? ???</div>
        <div>?????? ??????</div>
        <div>?????? ??????</div>
        <div>??????</div>
      </QnaHeader>
      <List>{qnaList}</List>
    </Container>
  );
};

export default UserQna;
