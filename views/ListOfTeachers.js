import React, { Component } from 'react';
import { View, StyleSheet, Image, Dimensions, ScrollView, TextInput } from 'react-native';
import ProfileBar from './subComponents/ProfileBar'
import TableCell from './subComponents/TableCell';


let deviceHeight = Dimensions.get('window').height;
let deviceWidth = Dimensions.get('window').width;

class ListOfTeachers extends React.Component {

state = {
        inputValue: '',
        data: [],
        teacher: 
        [
            {
                name: 'Grace Jacobs',
                location: 'Manhattan, NY',
                instrument: 'Guitar',
                picture: 'https://scontent-lga3-1.xx.fbcdn.net/v/t1.0-9/40482582_1687539791374401_1861957606596149248_n.jpg?_nc_cat=108&_nc_ohc=UYI3jh4nLKYAQneCwzUp7HEKi154WXmQobi1Ttxfl7cSo007KSqq-SrJA&_nc_ht=scontent-lga3-1.xx&oh=4de1bae06bfa24786863fa66e1447ebf&oe=5E815AC5',
                key: 0
            },
            {
                name: 'Andrew Besos',
                location: 'Queens, NY',
                instrument: 'Saxopphone',
                picture: 'https://thumbs.dreamstime.com/t/professional-headshot-man-56247494.jpg',
                key: 1
            },
            {
                name: 'Mary Sommers',
                location: 'Manhattan, NY',
                instrument: 'Flute',
                picture: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
                key: 2
            },
            {
                name: 'Bernard Johnson',
                location: 'Brooklyn, NY',
                instrument: 'Guitar',
                picture: 'https://images.squarespace-cdn.com/content/v1/514ffe4ee4b020d11228d65c/1402503323092-B5P7NO9BACDMY45UI1N0/ke17ZwdGBToddI8pDm48kCPztTQZpDiZMOuuCfUxiyx7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z5QPOohDIaIeljMHgDF5CVlOqpeNLcJ80NK65_fV7S1UYlQ-m0oNUh_9buvyC-f1CSdhG_dNlqULB2ZTz-ses64A-QPhXXvNcU0N8wN7BGx0g/image-asset.jpeg',
                key: 3
            },
            {
                name: 'Tina Smith',
                location: 'Manhattan, NY',
                instrument: 'Triangle',
                picture: 'http://blog.scottrklinephoto.com/wp-content/uploads/2013/10/Amy_Wigdahl_Headshot_15E9688-1024x683.jpg',
                key: 4
            },
            {
                name: 'Richard Martin',
                location: 'Manhattan, NY',
                instrument: 'Guitar',
                picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80',
                key: 5
            },
            {
                name: 'Liam West',
                location: 'Brooklyn, NY',
                instrument: 'Brooklyn, NY',
                picture: 'https://image1.masterfile.com/getImage/Njk4LTA3NTg4MzA1ZW4uMDAwMDAwMDA=AOcI0K/698-07588305en_Masterfile.jpg',
                key: 6
            },
            {
                name: 'Cynthia Williams',
                location: 'Manhattan, NY',
                instrument: 'Flute',
                picture: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRYW_ycIBW5Y4UrGN_We1RKTF966PjTYfdljzk_HJochHbcq9lx',
                key: 7
            },
        ]
}

handleTextChange = inputValue => {
    this.setState({ inputValue });
};

  render() {
    return (
        <View style={styles.container}>
            <ProfileBar 
                name={JSON.stringify(this.props.userData['name']).slice(3,-3)}
                image="https://api.time.com/wp-content/uploads/2017/12/terry-crews-person-of-year-2017-time-magazine-facebook-1.jpg?quality=85"
            />
            <View style={styles.searchBar}>
                <Image 
                    source={{ uri: 'http://fa2png.io/media/icons/font-awesome/4-7-0/search/256/0/274156_none.png' }}
                    style={styles.searchIcon}
                    />
                    <TextInput
                value={this.state.inputValue}
                onChangeText={this.handleTextChange}
                style={styles.searchInput}
                />
            </View>

            <ScrollView>
                {this.state.teacher.map(list => (
                    <TableCell
                        image = {list.picture}
                        name = {list.name}
                        instrument = {list.instrument}
                        location = {list.location}
                        key = {list.key}
                    />
                ))}
            </ScrollView>
        </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
     },
     searchBar:{
        height: deviceHeight/10,
        flexDirection: 'row',
        alignItems: 'center',
     },
     searchInput: {
        height: deviceHeight/18,
        width: (deviceWidth/5)*4,
        backgroundColor: '#eeeced',
        margin: 10,
        borderRadius: 10,
     },
    searchIcon:{
        width: deviceWidth/16,
        height: deviceWidth/16, 
        marginLeft: 20,
        marginRight: 5,
    },
});


//this lets the component get imported other places
export default ListOfTeachers;
