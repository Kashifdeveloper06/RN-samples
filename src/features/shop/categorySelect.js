import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { styles } from '../../styles';
import { connect } from 'react-redux';
import * as util from '../../utilities';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import * as TASKS from '../../store/actions';

class categorySelect extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
      <Image
        style={styles.parentHeaderLogo}
        resizeMode="contain"
        source={require('../../../assets/clientLogo.png')}
      />
    ),
  });

  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      bottomDrop: false,
      subdepartment: null,
      refresh: false,
      searchData: null,
    };
  }

  handleCatClick = (category, dept, sub) => {
    const params = {
      category_id: category.id,
      department_id: dept.id,
      sub_department: sub.id,
    };
    this.props.categoryProducts(params);
    this.props.navigation.navigate('CategoryList', {
      cat: category,
      department: dept,
      subDepartment: sub,
    });
  };
  handleSubDepartmentClick = (subdepartment, dept_id) => {
    if (this.props.country) {
      this.props.getCategories(subdepartment, dept_id, this.props.country);
    }
    this.setState({ subdepartment: subdepartment, searchData: null });
  };

  filterSearch = (search) => {
    const subDept = this.state.subdepartment
      ? this.state.subdepartment
      : this.props.navigation.getParam('subDepartment');
    let searchTerm = search.trim().toLowerCase();
    this.setState({ searchTerm: search });
    let data;
    data =
      subDept.categories &&
      subDept.categories.filter((el) => {
        return el.name.toLowerCase().match(searchTerm);
      });
    this.setState({
      searchData: data,
    });
  };

  render() {
    const { navigation } = this.props;
    const subDepartment = navigation.getParam('subDepartment');
    const department = navigation.getParam('department');
    console.log(this.state.searchData);
    return (
      <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
        <View
          style={{
            ...styles.lightBlueContainerMedium,
            height:
              util.isIphoneX() || util.isIphoneXSM()
                ? util.WP('26')
                : util.WP('23.5'),
            zIndex: 1,
          }}
        >
          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginLeft: 20,
              marginRight: 25,
              marginTop: util.HP(2),
            }}
          >
            <Text style={styles.h1ListTitle}>{subDepartment.name}</Text>
            <Text style={{ fontSize: util.WP(2.4), color: '#fff' }}>
              Scan bar code, search for specific item or select from the
              categories
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            bottom: util.WP(13) / 2,
            marginHorizontal: util.WP(5),
            height: util.WP(10),
            width: 'auto',
            zIndex: 100,
          }}
        >
          <TouchableOpacity
            style={{
              width: util.WP(15.3),
              height: util.WP(12),
              backgroundColor: '#00355F',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: util.WP(3),
              zIndex: 5,
              elevation: 1,
              shadowColor: '#000',
              shadowOffset: {
                width: 1,
                height: 5,
              },
              shadowOpacity: 0.5,
              shadowRadius: 2,
            }}
            onPress={() => navigation.navigate('Scan')}
          >
            <Image
              source={require('../../../assets/scan-white.png')}
              style={{ width: util.WP(8), height: util.WP(8) }}
            />
          </TouchableOpacity>
          <View
            style={{
              display: 'flex',
              zIndex: 5,
              alignItems: 'center',
              height: util.WP(12),
              backgroundColor: '#fff',
              flexDirection: 'row',
              paddingLeft: util.WP(5),
              paddingRight: util.WP(10),
              marginTop: 0,
              marginBottom: 0,
              flex: 1,
              elevation: 1,
              shadowColor: '#000',
              shadowOffset: {
                width: 1,
                height: 5,
              },
              shadowOpacity: 0.5,
              shadowRadius: 2,
            }}
          >
            <Image
              style={{
                height: util.WP(5),
                width: util.WP(5),
                marginRight: util.WP('2'),
              }}
              resizeMode="contain"
              source={require('../../../assets/search-blue.png')}
            />
            <TextInput
              style={{
                fontFamily: 'Montserrat-SemiBold',
                color: '#00355F',
                fontSize: util.WP(4),
                width: '100%',
                height: '100%',
              }}
              placeholder={'Search'}
              placeholderTextColor="#00355F"
              value={this.state.searchTerm}
              onChangeText={(text) => this.filterSearch(text)}
            />
          </View>
        </View>
        <View style={{ marginTop: util.WP(2) }}>
          {this.props.departments && subDepartment ? (
            <FlatList
              horizontal={true}
              data={this.props.departments}
              bounces={false}
              scrollEventThrottle={16}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1 }}
              renderItem={({ item: rowData, index }) => {
                if (rowData.id === department.id) {
                  return rowData.sub_departments.map((sub, index) => {
                    return (
                      <TouchableOpacity
                        onPress={() =>
                          this.handleSubDepartmentClick(sub.id, rowData)
                        }
                        key={sub.id}
                      >
                        <Text
                          style={{
                            marginHorizontal: util.WP(4),
                            fontFamily: 'Montserrat-SemiBold',
                            borderBottomWidth: this.state.subdepartment
                              ? this.state.subdepartment === sub.id
                                ? 2
                                : 0
                              : subDepartment.id === sub.id
                              ? 2
                              : 0,
                            color: this.state.subdepartment
                              ? this.state.subdepartment === sub.id
                                ? '#115281'
                                : '#2bb4e6'
                              : subDepartment.id === sub.id
                              ? '#115281'
                              : '#2bb4e6',
                            borderBottomColor: '#fdda00',
                            marginBottom: 20,
                            paddingBottom: util.WP(1.3),
                          }}
                          key={sub.id}
                        >
                          {sub.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  });
                }
              }}
              keyExtractor={(item) => String(item.id)}
            />
          ) : null}
        </View>
        {!this.props.lumperShown ? (
          subDepartment &&
          subDepartment.categories &&
          subDepartment.categories.length ? (
            this.state.searchData ? (
              <FlatList
                data={this.state.searchData}
                bounces={false}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
                renderItem={({ item: rowData, index }) => {
                  return (
                    <View
                      key={rowData.id}
                      style={{
                        backgroundColor: '#fff',
                        elevation: 2,
                        shadowColor: '#000',
                        shadowOpacity: 0.5,
                        shadowOffset: {
                          width: 0,
                          height: 5,
                        },
                        shadowRadius: 5,
                      }}
                    >
                      <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() =>
                          this.handleCatClick(
                            rowData,
                            department,
                            subDepartment
                          )
                        }
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingHorizontal: util.WP(6),
                          paddingVertical: util.WP(5.8),
                        }}
                      >
                        <Text
                          style={{
                            color: '#004a78',
                            fontSize: util.WP(3.2),
                            fontFamily: 'Montserrat-SemiBold',
                          }}
                        >
                          {rowData.name}
                        </Text>
                        <Image
                          source={require('../../../assets/angleDown.png')}
                          style={{
                            width: util.WP(3.6),
                            height: util.WP(2.3),
                            resizeMode: 'contain',
                            transform: [{ rotate: '-90deg' }],
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                }}
                keyExtractor={(item) => String(item.id)}
              />
            ) : this.state.subdepartment ? (
              <FlatList
                data={this.props.departments}
                bounces={false}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
                renderItem={({ item: rowData, index }) => {
                  if (rowData.id === department.id) {
                    return rowData.sub_departments.map((sub) => {
                      if (sub.id === this.state.subdepartment) {
                        return (
                          sub.categories &&
                          sub.categories.map((cat) => {
                            return (
                              <View
                                key={cat.id}
                                style={{
                                  backgroundColor: '#fff',
                                  elevation: 2,
                                  shadowColor: '#000',
                                  shadowOpacity: 0.5,
                                  shadowOffset: {
                                    width: 0,
                                    height: 5,
                                  },
                                  shadowRadius: 5,
                                }}
                              >
                                <TouchableOpacity
                                  activeOpacity={0.5}
                                  onPress={() =>
                                    this.handleCatClick(cat, rowData, sub)
                                  }
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    paddingHorizontal: util.WP(6),
                                    paddingVertical: util.WP(5.8),
                                  }}
                                >
                                  <Text
                                    style={{
                                      color: '#004a78',
                                      fontSize: util.WP(3.2),
                                      fontFamily: 'Montserrat-SemiBold',
                                    }}
                                  >
                                    {cat.name}
                                  </Text>
                                  <Image
                                    source={require('../../../assets/angleDown.png')}
                                    style={{
                                      width: util.WP(3.6),
                                      height: util.WP(2.3),
                                      resizeMode: 'contain',
                                      transform: [{ rotate: '-90deg' }],
                                    }}
                                  />
                                </TouchableOpacity>
                              </View>
                            );
                          })
                        );
                      }
                    });
                  }
                }}
                keyExtractor={(item) => String(item.id)}
              />
            ) : (
              <FlatList
                data={this.props.departments}
                bounces={false}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
                renderItem={({ item: rowData, index }) => {
                  if (rowData.id === department.id) {
                    return rowData.sub_departments.map((sub) => {
                      if (sub.id === subDepartment.id) {
                        return (
                          sub.categories &&
                          sub.categories.map((cat) => {
                            return (
                              <View
                                key={cat.id}
                                style={{
                                  backgroundColor: '#fff',
                                  elevation: 2,
                                  shadowColor: '#000',
                                  shadowOpacity: 0.5,
                                  shadowOffset: {
                                    width: 0,
                                    height: 5,
                                  },
                                  shadowRadius: 5,
                                }}
                              >
                                <TouchableOpacity
                                  activeOpacity={0.5}
                                  onPress={() =>
                                    this.handleCatClick(cat, rowData, sub)
                                  }
                                  style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    paddingHorizontal: util.WP(6),
                                    paddingVertical: util.WP(5.8),
                                  }}
                                >
                                  <Text
                                    style={{
                                      color: '#004a78',
                                      fontSize: util.WP(3.2),
                                      fontFamily: 'Montserrat-SemiBold',
                                    }}
                                  >
                                    {cat.name}
                                  </Text>
                                  <Image
                                    source={require('../../../assets/angleDown.png')}
                                    style={{
                                      width: util.WP(3.6),
                                      height: util.WP(2.3),
                                      resizeMode: 'contain',
                                      transform: [{ rotate: '-90deg' }],
                                    }}
                                  />
                                </TouchableOpacity>
                              </View>
                            );
                          })
                        );
                      }
                    });
                  }
                }}
                keyExtractor={(item) => String(item.id)}
              />
            )
          ) : (
            <Text
              style={{
                flex: 1,
                fontSize: util.WP(4),
                fontFamily: 'Montserrat-SemiBold',
                textAlign: 'center',
                marginTop: util.WP(40),
              }}
            >
              No categories
            </Text>
          )
        ) : (
          util.Lumper({ lumper: true })
        )}

        {/*
        <View>
          <TouchableWithoutFeedback
            onPress={() => this.setState({ bottomDrop: this.state.bottomDrop })}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#fc7401',
                paddingHorizontal: util.WP(4.9),
                paddingVertical: util.WP(3.0),
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={require('../../../assets/list.png')}
                  style={{
                    width: util.WP(6),
                    height: util.WP(7),
                    resizeMode: 'contain',
                  }}
                />
                <Text
                  style={{
                    fontSize: util.WP(3.6),
                    color: '#fff',
                    fontFamily: 'Montserrat-Medium',
                    marginLeft: util.WP(4),
                  }}
                >
                  Select list or Create new to add items
                </Text>
              </View>
              <Image
                source={require('../../../assets/up_arrow.png')}
                style={{
                  width: util.WP(4),
                  height: util.WP(2.6),
                  resizeMode: 'contain',
                }}
              />
            </View>
          </TouchableWithoutFeedback>
          <View style={{ height: 0 }}>
            <View
              style={{ paddingHorizontal: util.WP(7), paddingTop: util.WP(2) }}
            >
              <Text
                style={{
                  fontSize: util.WP(3.6),
                  fontFamily: 'Montserrat-Medium',
                  borderBottomWidth: 1,
                  paddingTop: util.WP(4.7),
                  paddingBottom: util.WP(4.7),
                  color: '#444444',
                  borderBottomColor: '#a1a1a1',
                }}
              >
                my list
              </Text>
              <TouchableOpacity
                style={{ marginTop: util.WP(9), marginBottom: util.WP(6) }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Image
                    source={require('../../../assets/yellow-plus.png')}
                    style={{ width: util.WP(3.6), height: util.WP(3.6) }}
                  />
                  <Text
                    style={{
                      marginLeft: util.WP(3.7),
                      fontSize: util.WP(4.8),
                      fontFamily: 'Montserrat-Medium',
                      color: '#fc7401',
                    }}
                  >
                    Create new list
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>*/}

      </View>
    );
  }
}

const mapStateToProps = (state) => {
  console.log(state);
  return {
    lumperShown: state.ui.isLoading,
    user: state.login.user,
    departments: state.Lists.departments,
    country: state.login.user.user_info.country,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getCategories: (id, dept_id, country_code) =>
      dispatch(TASKS.getCategories(id, dept_id, country_code)),
    categoryProducts: (params) => dispatch(TASKS.categoryProducts(params)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(categorySelect);
