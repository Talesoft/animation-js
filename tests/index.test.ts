import jestEach from 'jest-each';

describe('bem', () => {
    jestEach`
        bemResult                                         | className
    `.it('should convert expression to $className', ({ bemResult, className }) => {
    });
});
