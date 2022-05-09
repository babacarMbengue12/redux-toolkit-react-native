import React from "react";
import {
  Button,
  Dimensions,
  FlatList,
  Modal,
  RefreshControl,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  useCreatePostMutation,
  useDeletePostMutation,
  useGetPostsQuery,
  useUpdatePostMutation,
} from "../api";

const Posts = () => {
  const { data, isLoading, refetch } = useGetPostsQuery();
  const [show, setShow] = React.useState(false);
  return (
    <View style={{ flex: 1, backgroundColor: "#EEE" }}>
      <CreatePostModal visible={show} onHide={() => setShow(false)} />
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            colors={["#000"]}
            onRefresh={refetch}
          />
        }
        contentContainerStyle={{ padding: 20 }}
        ListHeaderComponent={
          <View style={{ marginVertical: 20 }}>
            <Button
              color={"#000"}
              title="New post"
              onPress={() => setShow(true)}
            />
          </View>
        }
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <Post item={item} />}
      />
    </View>
  );
};

export default Posts;

const Post = ({ item }) => {
  const [deletePost, { isLoading }] = useDeletePostMutation();
  const [show, setShow] = React.useState(false);

  return (
    <View style={{ backgroundColor: "#FFF", padding: 15, marginBottom: 10 }}>
      <CreatePostModal
        visible={show}
        onHide={() => setShow(false)}
        item={item}
      />
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.title}</Text>
      <Text style={{ fontSize: 12, marginTop: 10, textAlign: "justify" }}>
        {item.body}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <View style={{ alignSelf: "flex-end" }}>
          <Button color={"#000"} title="Update" onPress={() => setShow(true)} />
        </View>
        <View style={{ alignSelf: "flex-end" }}>
          {!isLoading && (
            <Button
              color={"#F00"}
              title="Delete"
              onPress={() => deletePost(item)}
            />
          )}
          {isLoading && <Button color={"#F00"} title="Deleting" />}
        </View>
      </View>
    </View>
  );
};
const { width } = Dimensions.get("window");

const CreatePostModal = ({ visible, onHide, item }) => {
  const [createPost, { isLoading, isSuccess }] = useCreatePostMutation();
  const [updatePost, { isLoading: uIsLoading, isSuccess: uIsSuccess }] =
    useUpdatePostMutation();
  const [title, setTitle] = React.useState(item?.title || "");
  const [body, setBody] = React.useState(item?.body || "");
  const loading = isLoading || uIsLoading;
  const success = isSuccess || uIsSuccess;
  React.useEffect(() => {
    if (success) {
      setTitle("");
      setBody("");
      onHide();
    }
  }, [success]);
  return (
    <Modal visible={visible} onRequestClose={onHide}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0,0,0,.3)",
        }}
      >
        <View
          style={{ backgroundColor: "#FFF", width: width * 0.8, padding: 15 }}
        >
          <Text
            style={{ fontSize: 18, textAlign: "center", marginVertical: 10 }}
          >
            Create post
          </Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            style={{
              height: 54,
              backgroundColor: "#EEE",
              paddingHorizontal: 15,
              borderRadius: 3,
            }}
            placeholder="Title"
          />
          <TextInput
            value={body}
            textAlignVertical="top"
            onChangeText={setBody}
            style={{
              marginVertical: 10,
              textAlignVertical: "top",
              minHeight: 120,
              backgroundColor: "#EEE",
              paddingHorizontal: 15,
              borderRadius: 3,
            }}
            placeholder="Body"
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <View style={{ alignSelf: "flex-end" }}>
              <Button color={"#F00"} title="Cancel" onPress={onHide} />
            </View>
            <View style={{ alignSelf: "flex-end" }}>
              {!loading && (
                <Button
                  color={"#000"}
                  title={item ? "Update" : "Add"}
                  onPress={() => {
                    if (item) {
                      updatePost({ ...{ _id: item._id, title, body } });
                    } else {
                      createPost({ title, body });
                    }
                  }}
                />
              )}
              {loading && (
                <Button color={"#000"} title={item ? "Updating" : "Adding"} />
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
