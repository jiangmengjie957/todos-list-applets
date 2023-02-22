import {
  Image,
  Text,
  View,
  Input,
} from "@tarojs/components";
import { setStorage, getStorage, showToast } from "@tarojs/taro";
import { useState, useEffect } from "react";
import styles from "./styles.module.less";
import person1 from "@/resource/image/NO.0001.png";
import person2 from "@/resource/image/NO.0002.png";
import person3 from "@/resource/image/NO.0003.png";
import person4 from "@/resource/image/NO.0004.png";
import person5 from "@/resource/image/NO.0005.png";
import person6 from "@/resource/image/NO.0006.png";
import person7 from "@/resource/image/NO.0007.png";
import person8 from "@/resource/image/NO.0008.png";
import person9 from "@/resource/image/NO.0009.png";
import person10 from "@/resource/image/NO.0010.png";
import person11 from "@/resource/image/NO.0011.png";
import person12 from "@/resource/image/NO.0012.png";
import dayjs from "dayjs";

const personList = [
  person1,
  person2,
  person3,
  person4,
  person5,
  person6,
  person7,
  person8,
  person9,
  person10,
  person11,
  person12
];
const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};
const personImg = personList[getRandomInt(personList.length)];

const saveNowTime = () => {
  setStorage({
    key: "timeInfo",
    data: JSON.stringify(+new Date()),
  });
};
interface ITodosListItem {
  key: string;
  value: string;
  isCheck: boolean;
}

const TodosRow = (props: {
  item: ITodosListItem;
  checkTodo: (key: string) => void;
  todo: boolean;
}) => {
  const { item, checkTodo, todo } = props;
  const iconStyle = {
    fontSize: "24px",
    color: "#ccc",
    textDecoration: item.isCheck ? "line-through" : "none",
  };
  const thingStyle = {
    textDecoration: item.isCheck ? "line-through" : "none",
    color: !item.isCheck ? "#333" : "#ccc",
  };
  if (!item.isCheck && !todo) return null;
  if (item.isCheck && todo) return null;

  return (
    <View className={styles.todosRow}>
      <View className={styles.todosThings} style={thingStyle}>
        {item.value}
      </View>
      <Text
        className="iconfont icon--todo"
        style={iconStyle}
        onClick={() => checkTodo(item.key)}
      />
    </View>
  );
};

const Todos = () => {
  const [lastTime, setLastTime] = useState<string | undefined | number>(
    undefined
  );
  const [iptValue, setIptValue] = useState<string>("");
  const [todosList, setTodosList] = useState<ITodosListItem[]>([]);
  const [fold, setFold] = useState<boolean>(false);

  useEffect(() => {
    todosList.length > 0 &&
      setStorage({
        key: "todoList",
        data: JSON.stringify(todosList),
      });
    saveNowTime();
  }, [todosList, todosList.length]);

  useEffect(() => {
    try {
        getStorage({
            key: "todoList",
            success: (res) => {
                console.log(res,'res')
                setTodosList(JSON.parse(res?.data || "[]"));
            },
            fail: (err) => {
                console.log(err,'err')
            }
          });
    } catch (error) {
        console.log(error,'error')
    }
  }, []);

  getStorage({
    key: "timeInfo",
    success: (res) => {
      try {
        setLastTime(JSON.parse(res?.data));
      } catch (error) {
        //
      }
    },
  });
  const submit = () => {
    if (!iptValue) {
      showToast({
        title: "写点东西再提交哦",
        icon: "error",
      });
      return;
    }
    const newList = todosList;
    newList.unshift();
    setTodosList((list) => {
      const timeId = (+new Date()).toString();
      return [
        {
          key: timeId,
          value: iptValue,
          isCheck: false,
        },
        ...list,
      ];
    });
    setIptValue('')
    showToast({
      title: "增加成功",
    });
  };

  const checkTodo = (key: string) => {
    setTodosList((item) => {
      return item.map((i) => {
        if (i.key === key) {
          i.isCheck = true;
        }
        return i;
      });
    });
  };
  const hasFold = todosList.some(item => item.isCheck)
  const notHasNewTodos = !!todosList.length && !todosList.some(item => !item.isCheck)

  return (
    <View className={styles.imgContainer}>
      <View className={styles.title}>TODOS</View>
      <View className={styles.desContainer}>
        <Image
          src={personImg}
          mode="aspectFit"
          className={styles.personImg}
        ></Image>
        <View className={styles.desRight}>
          <View>上次修改时间: </View>
          <View style={{ color: "DarkSlateBlue" }}>
            {lastTime
              ? dayjs(lastTime).format("YYYY-MM-DD HH:mm:ss")
              : "哟~还是第一次来呢"}
          </View>
          <View>
            现在时间:{" "}
            <Text style={{ color: "DarkSlateBlue" }}>
              {dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss")}
            </Text>
          </View>
        </View>
      </View>
      <View className={styles.todosTitle}>告诉我你的新待办哈</View>
      <View className={styles.formContainer}>
        <View className={styles.iptContainer}>
          <Input
            className={styles.ipt}
            value={iptValue}
            onInput={(val) => {
              setIptValue(val.detail.value.toString().trim());
            }}
            onConfirm={submit}
          />
          <Text
            onClick={submit}
            className="iconfont icon-TODO"
            style={{ fontSize: "32px" }}
          />
        </View>
      </View>
      <View className={styles.todosContainer}>
        {todosList.map((item) => (
          <TodosRow item={item} checkTodo={checkTodo} todo />
        ))}
        {
            !todosList.length && <View className={styles.default}>快来开始你的第一条待办吧!</View>
        }
        {
            notHasNewTodos && <View className={styles.default}>哇，全部都完成了，太棒了！</View>
        }
        {hasFold && (
          <View className={styles.foldContainer}>
            <View
              className={styles.fold}
              onClick={() => setFold((fold) => !fold)}
            >
              {fold ? "收起" : "展开"}已完成事项--{">"}
            </View>
          </View>
        )}
        {fold &&
          todosList.map((item) => (
            <TodosRow item={item} checkTodo={checkTodo} todo={false} />
          ))}
      </View>
    </View>
  );
};

export default Todos;
