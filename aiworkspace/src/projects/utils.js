export const arrFormatToTree = (arr) => {
    const map = {};
    const tree = [];
  
    arr.forEach((item) => {
      map[item.id] = { ...item, children: [] };
    });
  
    arr.forEach((item) => {
      if (item.parent === 0) {
        tree.push(map[item.id]);
      } else {
        map[item.parent]?.children.push(map[item.id]);
      }
    });
  
    return tree;
  };
  
  export const delayStartDate = (tasks, delayDays) => {
    return tasks.map((task) => {
      const newStartDate = new Date(task.start_date);
      newStartDate.setDate(newStartDate.getDate() + delayDays);
  
      return {
        ...task,
        start_date: newStartDate.toISOString().split("T")[0],
      };
    });
  };
  