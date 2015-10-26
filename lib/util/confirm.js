import inquirer from 'inquirer';
import Promise from 'bluebird';

export default () => {
  return new Promise((resolve, reject) => {
    if (!process.stdout.isTTY) {
      return reject('non-interactive tty');
    }

    const question = {
      type: 'confirm',
      name: 'confirm',
      default: false,
      message: 'Are you sure?',
    };

    inquirer.prompt([question], (answers) => {
      return answers.confirm
        ? resolve()
        : reject();
    });
  });
};
