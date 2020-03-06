import chai from 'chai';

const {expect} = chai;

export const mongoObjectId = function() {
    const timestamp = (new Date().getTime() / 1000 | 0).toString(16);
    return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
        return (Math.random() * 16 | 0).toString(16);
    }).toLowerCase();
};


export const baseExpect = function(body, code, apiUrl, success, method) {
    expect(body).to.not.be.undefined;
    expect(body).to.have.property('code');
    expect(body).to.have.property('method');
    expect(body).to.have.property('apiURL');
    expect(body).to.have.property('success');
    expect(body).to.have.property('response');

    expect(body.code).to.equal(code);
    expect(body.method).to.equal(method);
    expect(body.apiURL).to.equal(apiUrl);
    expect(body.success).to.equal(success);
    expect(body.response).to.be.an('object');
};