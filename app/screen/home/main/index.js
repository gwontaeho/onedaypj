import React, {useState, useCallback, useEffect} from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import axios from '../../../axios';
import {Divider} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import SplashScreen from 'react-native-splash-screen';

import styles from './styles';

const Main = props => {
  const [popClass, setPopClass] = useState([]);
  const [newClass, setNewClass] = useState([]);

  useEffect(() => {
    requestProductData();
  }, []);

  const requestProductData = useCallback(async () => {
    try {
      const response = await axios.get('/api/product/main');
      console.log(response.data);
      setPopClass(response.data.popProduct);
      setNewClass(response.data.newProduct);
    } catch (error) {
      console.log(error);
    }
    SplashScreen.hide();
  }, []);

  const onPressCategory = useCallback(
    (v, vv) => {
      props.navigation.navigate('Category', {
        categoryName: v,
        title: vv,
      });
    },
    [props.navigation],
  );

  const onPressProduct = useCallback(v => {
    props.navigation.navigate('Product', {
      id: v.id,
    });
  }, []);

  const renderItem = ({item}) => {
    console.log(item);
    const uri =
      'http://172.30.1.27:3005' +
      item.img.replace(/\\/gi, '/').replace(/public/gi, '');
    return (
      <TouchableOpacity
        style={styles.content}
        onPress={() => onPressProduct(item)}>
        <View>
          <Image
            source={{
              uri,
            }}
            style={styles.content_image}
          />
          <View style={[styles.content_view, styles.content_address]}>
            <Icon name="location-outline" color="white" />
            <Text style={[{color: 'white'}, styles.content_text]}>
              {item.address.split('&')[0]}
            </Text>
          </View>
        </View>

        <View style={styles.content_view}>
          <Text style={[styles.content_text, {minHeight: 36}]}>
            {`[${item.category}] ${item.name}`}
          </Text>
        </View>
        <View style={styles.content_view}>
          <Text style={styles.content_price}>{item.price}???</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../../image/logo/logo.png')}
          style={styles.logo_image}
        />
      </View>
      <Divider />

      <ScrollView>
        <View style={styles.banner}>
          <Image
            source={require('../../../image/ad/ad.png')}
            style={styles.banner_image}
          />
        </View>
        <Divider />

        <View style={styles.categories}>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.category}
              onPress={() => onPressCategory('flower', '?????????')}>
              <Image
                source={require('../../../image/category/flower.png')}
                style={styles.category_image}
              />
              <Text style={styles.category_text}>?????????</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.category}
              onPress={() => onPressCategory('art', '??????')}>
              <Image
                source={require('../../../image/category/art.png')}
                style={styles.category_image}
              />
              <Text style={styles.category_text}>??????</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.category}
              onPress={() => onPressCategory('cooking', '??????')}>
              <Image
                source={require('../../../image/category/cooking.png')}
                style={styles.category_image}
              />
              <Text style={styles.category_text}>??????</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.category}
              onPress={() => onPressCategory('handmade', '?????????')}>
              <Image
                source={require('../../../image/category/handmade.png')}
                style={styles.category_image}
              />
              <Text style={styles.category_text}>?????????</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.category}
              onPress={() => onPressCategory('activity', '????????????')}>
              <Image
                source={require('../../../image/category/activity.png')}
                style={styles.category_image}
              />
              <Text style={styles.category_text}>????????????</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.category}
              onPress={() => onPressCategory('etc', '??????')}>
              <Image
                source={require('../../../image/category/etc.png')}
                style={styles.category_image}
              />
              <Text style={styles.category_text}>??????</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.row_all}
            onPress={() => onPressCategory('all', '??????')}>
            <Text style={styles.category_text}>??????</Text>
            <Icon name="chevron-down-outline" color="black" size={15} />
          </TouchableOpacity>
        </View>

        <Divider />

        <View style={styles.classList}>
          <View style={styles.title}>
            <Text style={styles.title_text}>?????? ?????????</Text>
          </View>
          <View style={styles.list}>
            <FlatList
              data={popClass}
              renderItem={renderItem}
              horizontal={true}
              keyExtractor={item => item.id}
            />
          </View>
        </View>

        <Divider />

        <View style={styles.classList}>
          <View style={styles.title}>
            <Text style={styles.title_text}>?????? ?????????</Text>
          </View>
          <View style={styles.list}>
            <FlatList
              data={newClass}
              renderItem={renderItem}
              horizontal={true}
              keyExtractor={item => item.id}
            />
          </View>
        </View>
        <View style={styles.footer}></View>
      </ScrollView>
    </View>
  );
};

export default Main;
