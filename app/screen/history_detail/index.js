import React, {useEffect, useState, useCallback} from 'react';
import {Text, View, TouchableOpacity, FlatList, Image} from 'react-native';
import {Button, Divider, Dialog, Portal} from 'react-native-paper';
import axios from '../../axios';
import styles from './styles';

const HistoryDetail = props => {
  const [visible, setVisible] = useState(false);
  const [historyData, setHistoryData] = useState({});

  useEffect(() => {
    console.log(props.route.params.id);
    requestHistoryData();
  }, []);

  const requestHistoryData = useCallback(async () => {
    try {
      const response = await axios.get(
        `/api/reservation/${props.route.params.id}`,
        {
          headers: {
            token: props.route.params.token,
          },
        },
      );
      console.log(response.data);
      setHistoryData(response.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const cancel = useCallback(() => {
    if (historyData.state === 0) {
      onClickCancelRequest();
    } else {
      onClickCancelWaiting();
    }
    hideDialog();
  }, [historyData]);

  const onClickCancelWaiting = useCallback(async () => {
    try {
      const response = await axios.put(
        '/api/reservation/cancel/waiting',
        {
          id: historyData.id,
        },
        {
          headers: {
            token: props.route.params.token,
          },
        },
      );
      requestHistoryData();
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }, [historyData]);

  const onClickCancelRequest = useCallback(async () => {
    try {
      const response = await axios.put(
        '/api/reservation/cancel/request',
        {
          id: historyData.id,
        },
        {
          headers: {
            token: props.route.params.token,
          },
        },
      );
      requestHistoryData();
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }, [historyData]);

  const hideDialog = () => setVisible(false);

  return Object.keys(historyData).length === 0 ? null : (
    <View style={styles.container}>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>????????? ???????????????????????? ?</Dialog.Title>
          <Dialog.Actions>
            <Button onPress={hideDialog}>?????????</Button>
            <Button onPress={cancel}>???</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <View style={styles.header}>
        <Text>?????? ??????</Text>
      </View>
      <Divider />
      <View style={styles.info}>
        <View style={styles.img_container}>
          <Image
            source={{
              uri:
                'http://172.30.1.27:3005' +
                historyData.product.img
                  .replace(/\\/gi, '/')
                  .replace(/public/gi, ''),
            }}
            style={styles.img}
          />
        </View>
        <View style={styles.text}>
          <Text>????????? ??? : </Text>
          <Text>
            [{historyData.product.category}] {historyData.product.name}
          </Text>
        </View>

        <Text style={styles.text}>
          ?????? ?????? :{' '}
          {String(historyData.schedule.ymd).substr(0, 4) +
            '.' +
            String(historyData.schedule.ymd).substr(4, 2) +
            '.' +
            String(historyData.schedule.ymd).substr(6, 2) +
            ' / ' +
            historyData.schedule.start.substr(0, 2) +
            ':' +
            historyData.schedule.start.substr(2, 2) +
            '~' +
            historyData.schedule.end.substr(0, 2) +
            ':' +
            historyData.schedule.end.substr(2, 2)}
        </Text>
        <Text style={styles.text}>
          ?????? ?????? :{' '}
          {historyData.createdAt.substr(0, 4) +
            '.' +
            historyData.createdAt.substr(5, 2) +
            '.' +
            historyData.createdAt.substr(8, 2)}
        </Text>
        <Text style={styles.text}>?????? ?????? : {historyData.personnel} ???</Text>
        <Text style={styles.text}>
          ?????? ?????? :{' '}
          {historyData.state === 0
            ? '?????? ???'
            : historyData.state === 1 || historyData.state === 5
            ? '?????? ??????'
            : historyData.state === 2
            ? '?????? ??????'
            : historyData.state === 3
            ? '??????'
            : '?????? ??????'}
        </Text>
      </View>

      <View style={styles.button_container}>
        {historyData.state === 0 || historyData.state === 4 ? (
          <TouchableOpacity
            style={styles.button}
            onPress={() => setVisible(true)}>
            <Text>?????? ??????</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

export default HistoryDetail;
