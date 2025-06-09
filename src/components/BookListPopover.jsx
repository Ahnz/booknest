import { Popover, List, ListItem } from "konsta/react";

const BookListPopover = ({ opened, target, items, onClose }) => (
  <Popover opened={opened} target={target} onBackdropClick={onClose}>
    <List nested>
      {items.map((item, index) => (
        <ListItem key={index} title={item.title} link onClick={item.onClick} />
      ))}
    </List>
  </Popover>
);

export default BookListPopover;
