import Contact from "../contact";
import ContactAttachment from "../contactAttachments";
import ContactTag from "../contactTag";
import Media from "../mediaModel";
import SubTask from "../subtask";
import Tag from "../tag";
import Task from "../task";
import TaskTag from "../taskTag";
import Pipeline from "../pipeline";

Contact.belongsToMany(Tag, {
  through: ContactTag,
  as: "tags",
  foreignKey: "contactId",
  otherKey: "tagId",
});

Tag.belongsToMany(Contact, {
  through: ContactTag,
  as: "contacts",
  foreignKey: "tagId",
  otherKey: "contactId",
});

Contact.hasMany(ContactTag, {
  foreignKey: "contactId",
  as: "contactTags",
});
ContactTag.belongsTo(Contact, { foreignKey: "contactId", as: "contacts" });

Task.belongsToMany(Tag, {
  through: TaskTag,
  as: "tags",
  foreignKey: "taskId",
  otherKey: "tagId",
});

Tag.belongsToMany(Task, {
  through: TaskTag,
  as: "tasks",
  foreignKey: "tagId",
  otherKey: "taskId",
});

Task.hasMany(TaskTag, {
  foreignKey: "taskId",
  as: "taskTags",
});

TaskTag.belongsTo(Task, { foreignKey: "taskId", as: "tasks" });

Task.hasMany(SubTask, {
  foreignKey: "taskId",
  as: "subTasks",
});

SubTask.belongsTo(Task, {
  foreignKey: "taskId",
  as: "task",
});

Contact.belongsTo(Media, {
  foreignKey: "profile_picture_id",
  as: "profile",
});

Contact.hasMany(ContactAttachment, {
  foreignKey: "contact_id",
  as: "files",
});



export { Contact, Tag, ContactTag, TaskTag, Task, SubTask, Media, Pipeline };
