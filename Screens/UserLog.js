import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";

const UserLog = ({ route }) => {
    const [logs, setLogs] = useState([]);
    const user = route.params;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${url}/user_log/${user.userID}`);
                const data = await response.json();
                if (response.ok) {
                    const correctedLogs = data.message.map((log) => ({
                        ...log,
                        img_path: log.img_path.replace("http://192.168.1.2:5000", url),
                    }));
                    setLogs(correctedLogs);
                } else {
                    console.error("Error fetching logs", data);
                }
            } catch (error) {
                console.error("Error connecting to server", error);
            }
        };
        fetchData();
    }, []);

    const renderLogItem = ({ item }) => (
        <View style={styles.logItemContainer}>
            <Text style={styles.dateTimeText}>{item.date}          {item.time}</Text>
            <View style={styles.logContainer}>
                <View style={{ flex: 3, padding: 10 }}>
                    <Text style={styles.logText}>
                        <Text style={styles.boldText}>Object Type:</Text> {item.detected_object}
                    </Text>
                    <Text style={styles.logText}>
                        <Text style={styles.boldText}>Alert:</Text> {item.alert}
                    </Text>
                    <Text style={styles.logText}>
                        <Text style={styles.boldText}>Distance:</Text> {item.distance.toFixed(2)} m
                    </Text>
                </View>
                <Image
                    source={{ uri: item.img_path }}
                    style={styles.image}
                    resizeMode="cover"
                />
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>User Log</Text>
                <TouchableOpacity style={styles.filterIcon}>
                <Image
                    source={require('../Images/filter.png')}     
                />
                </TouchableOpacity>
                
            </View>

            <FlatList
                data={logs}
                keyExtractor={(item) => item.log_id.toString()}
                renderItem={renderLogItem}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#102C57",
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 30,
        position: 'relative', // Needed for absolute positioning of the filter icon
    },
    header: {
        color: "white",
        fontWeight: "900",
        fontSize: 30,
    },
    filterIcon: {
        position: 'absolute', // Position the filter icon absolutely
        right: 15, // Add margin from the right
    },
    logItemContainer: {
        marginHorizontal: 15,
        marginBottom: 20,
    },
    dateTimeText: {
        color: "white",
        fontSize: 14,
        marginBottom: 5,
        fontWeight: "900",
        paddingLeft:5
    },
    logContainer: {
        backgroundColor: "#D9D9D9",
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        overflow: "hidden",
    },
    logText: {
        fontSize: 14,
        marginBottom: 5,
    },
    boldText: {
        fontWeight: "900",
    },
    image: {
        flex: 1,
        width: "100%",
        height: "100%",
        maxWidth: 70,
        maxHeight: 70,
        borderRadius: 5,
        margin: 10,
    },
});

export default UserLog;