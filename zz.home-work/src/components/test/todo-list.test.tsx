import { fireEvent, render } from '@testing-library/react';
import App from '../../App';
import { format } from 'date-fns';

/** 투두 추가하기 */
const addTodo = () => {
  const AppRenderResult = render(<App />);
  const { getByTestId } = AppRenderResult;

  const todoFormText = getByTestId('todo-form-text');
  const todoFormDeadline = getByTestId('todo-form-deadline');
  const todoFormButton = getByTestId('todo-form-button');

  fireEvent.change(todoFormText, {target: {value: '파운드 자르기'}});
  fireEvent.change(todoFormDeadline, {
    target: { value: format(new Date(), 'yyyy-MM-dd') },
  })
  fireEvent.click(todoFormButton);
  return AppRenderResult;
};

/** 투두 추가 후 체크하기 */
const checkTodo = () => {
  // GIVEN
  const { getByTestId } = addTodo();

  const todoItemCheckbox = getByTestId(/todo-item-checkbox/);
  const todoItemText = getByTestId(/todo-item-text/);

  // WHEN: 비활성화된 체크박스를 클릭한다.
  fireEvent.click(todoItemCheckbox);
  return { todoItemCheckbox, todoItemText }
}

describe('todo list test', () => {
  it('비활성화된 체크박스를 클릭하면 취소선이 그어진다.', () => {
    const { todoItemText } = checkTodo();

    // THEN: 취소선이 그어진다.
    expect(todoItemText.style.textDecoration).toBe('line-through');
  });

  it('체크된 체크박스를 클릭하면 취소선이 사라진다.', () => {
    const { todoItemCheckbox, todoItemText } = checkTodo();

    // WHEN: 체크된 체크박스를 클릭한다.
    fireEvent.click(todoItemCheckbox);

    // THEN: 취소선이 사라진다.
    expect(todoItemText.style.textDecoration).toBe('none');
  })

  it('휴지통 아이콘을 클릭하면 투두가 삭제된다.', () => {
    const { getByTestId, queryByTestId  } = addTodo();
    const todoListItem = queryByTestId(/todo-list-item/);
    const deleteIconButton = getByTestId(/delete-icon-button/);

    // WHEN: 휴지통 아이콘을 클릭한다.
    fireEvent.click(deleteIconButton);

    // THEN: 투두가 삭제된다.
    expect(queryByTestId(todoListItem)).not.toBeInTheDocument();
  })
})