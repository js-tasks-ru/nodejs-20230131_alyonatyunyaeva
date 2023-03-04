const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {

    it('нельзя ввести строку короче заданной длины', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ name: 'Lalala' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
    });
    
    it('нельзя ввести строку длиннее заданной длины', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ name: 'LalalaLalalaLalalaLalala' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 20, got 24');
    });

    it('нельзя ввести число меньше заданного значения', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 16,
          max: 120,
        },
      });

      const errors = validator.validate({ age: 9 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 16, got 9');
    });

    it('нельзя ввести число больше заданного значения', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 16,
          max: 120,
        },
      });

      const errors = validator.validate({ age: 134 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 120, got 134');
    });

    it('валидатор проверяет только переданные в него правила', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ age: 10, name: 'jhhv', });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('there is no rule for string');
    });
  });
});
