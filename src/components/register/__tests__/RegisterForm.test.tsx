import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import RegisterForm, { RegisterFormProps } from '../RegisterForm';
import { MemoryRouter } from 'react-router';

describe('RegisterForm', () => {
  const setup = (props: Partial<RegisterFormProps> = {}) => {
    const initialProps: RegisterFormProps = {
      onSubmit: () => {},
      fixedEmail: null,
      error: null,
      defaultInfo: null,
    };
    const utils = render(
      <MemoryRouter>
        <RegisterForm {...initialProps} {...props} />
      </MemoryRouter>,
    );
    const form = {
      name: utils.getByPlaceholderText(/이름을/) as HTMLInputElement,
      email: utils.queryByPlaceholderText(/이메일을/) as HTMLInputElement,
      username: utils.getByPlaceholderText(/아이디를/) as HTMLInputElement,
      shortBio: utils.getByPlaceholderText(/당신을/) as HTMLInputElement,
    };

    const changeInputs = () => {
      fireEvent.change(form.name, {
        target: {
          value: '벨로퍼트',
        },
      });

      // fireEvent.change(form.email, {
      //   target: {
      //     value: 'public.velopert@gmail.com',
      //   },
      // });

      fireEvent.change(form.username, {
        target: {
          value: 'velopert',
        },
      });

      fireEvent.change(form.shortBio, {
        target: {
          value: '안녕하세요',
        },
      });
    };

    return {
      ...utils,
      form,
      changeInputs,
    };
  };

  it('renders properly', () => {
    setup();
  });
  it('matches snapshot', () => {
    const { container } = setup();
    expect(container).toMatchSnapshot();
  });

  it('changes input', () => {
    const utils = setup();
    const { form, getByDisplayValue, changeInputs } = utils;
    changeInputs();
    getByDisplayValue('벨로퍼트');
    getByDisplayValue('velopert');
    getByDisplayValue('안녕하세요');
  });

  it('submits form', () => {
    const onSubmit = jest.fn();
    const utils = setup({
      onSubmit,
    });
    const { getByText } = utils;
    utils.changeInputs();
    const button = getByText('다음');
    fireEvent.click(button);
    expect(onSubmit).toBeCalledWith({
      displayName: '벨로퍼트',
      email: '',
      username: 'velopert',
      shortBio: '안녕하세요',
    });
  });

  it('should show default email and lock', () => {
    const utils = setup({
      fixedEmail: 'public.velopert@gmail.com',
    });
    expect(utils.form.email.value).toBe('public.velopert@gmail.com');
    expect(utils.form.email.disabled).toBeTruthy();
    expect(utils.container.querySelector('svg')).toBeVisible();
  });
});
