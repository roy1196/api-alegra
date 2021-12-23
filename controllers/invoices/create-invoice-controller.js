const base64 = require('base-64');
const moment = require('moment')

const BaseController = require('../base-controller');
const AxiosHelper = require('../../utils/axios-helper');

class CreateInvoinceController extends BaseController {

    constructor(data) {
        super();
        this._data = data;
        this._client = data.client;
        this.key_alegra = base64.encode(`${global.config.alegra.user}:${global.config.alegra.token}`);
        this._axiosHelper = new AxiosHelper();
        // console.log("🚀 ~ file: create-invoice-controller.js ~ line 3 ~ CreateInvoinceController ~ constructor ~ data", data)

    }
    /** @override */
    async _onValidate() {
        return true;
    }

    async create_client() {
        const client_name = this._client.name;
        const client_phone = this._client.phone;
        const client_email = this._client.email;
        const client_id_type = this._client.identification.type;
        const client_id_number = this._client.identification.number;

        const client_addr_address = this._client.address.address;
        const client_addr_department = this._client.address.department;
        const client_addr_city = this._client.address.city;
        const client_addr_district = this._client.address.district;

        const body = {
            "name": client_name,
            "identificationObject": {
                "type": client_id_type,
                "number": client_id_number
            },
            "address": {
                "address": client_addr_address,
                "department": client_addr_department,
                "city": client_addr_city,
                "district": client_addr_district
            },
            "phonePrimary":client_phone,
            email: client_email
        }
        let result = await this._axiosHelper.makeRequest(`${global.config.alegra.url}/contacts`, 'POST',
            { "Authorization": `Basic ${this.key_alegra}` }, {}, body);

        // console.log("🚀 ~ file: create-invoice-controller.js ~ line 54 ~ CreateInvoinceController ~ create_client ~ result", result.isError)

        if (result.isError) {
            return null;
        } else {
            return result.data.id;
        }
        // console.log(body);
    }

    async get_taxes() {
        let result = await this._axiosHelper.makeRequest(`${global.config.alegra.url}/taxes`, 'GET', { "Authorization": `Basic ${this.key_alegra}` });
        if (result.isError) {
            return null;
        } else {
            return result['0'].id;
        }
    }

    /** @override */
    async _onSave() {

        const date = moment().format('YYYY-MM-DD');
        const dueDate = moment().add(1, 'days').format('YYYY-MM-DD');
        const anotation = this._data.anotation;
        const observations = this._data.observations;
        const status = this._data.status;
        const client = await this.create_client();
        const tax = await this.get_taxes();
        const items = this._data.items;

        // CASH Contado
        // CREDIT Crédito
        // CONSIGNATION Consignación
        // SEPARATED Apartado
        // LEASING_WITH_PURCHASE_OPTION Arrendamiento con opción de compra
        // LEASING_IN_FINANTIAL_FUNCTION Arrendamiento en función financiera
        // PAYMENT_IN_FAVOR_OF_A_THIRD Cobro a favor de un tercero
        // SERVICES_PROVIDED_TO_STATE_TO_CREDIT Servicios prestados al Estado a crédito
        // PAYMENTS_OF_SERVICES_PROVIDED_TO_STATE Pagos de servicio prestado al Estado
        // OTHER Otros
        const saleCondition = this._data.saleCondition;


        // cash Efectivo, 
        // card Tarjeta débito/crédito, 
        // check Cheque, 
        // transfer Transferencia - depósito bancario, 
        // collection-by-third Recaudo por teceros, other Otros métodos de pago. 
        const paymentMethod = this._data.paymentMethod;
        //Preguntar que pasa si el cliente es null

        const body = {
            date,
            dueDate,
            observations,
            anotation,
            status,
            client,
            stamp: {
                generateStamp: false
            },
            paymentMethod,
            saleCondition,
            items
        };
        // currency: {
        //     code: "CRC",
        //     exchangeRate: 1
        // },
        let result = await this._axiosHelper.makeRequest(`${global.config.alegra.url}/invoices`, 'POST',
        { "Authorization": `Basic ${this.key_alegra}` }, {}, body);
        console.log("🚀 ~ file: create-invoice-controller.js ~ line 128 ~ CreateInvoinceController ~ _onSave ~ result", result.isError)
        if (result.isError) {
            return result;
        } else {
            console.log(result.data);
            return {
                message:"La factura ha sido creado en Alegra Exitosamente",
                id:result.data.id
            }
        }
        console.log("🚀 ~ file: create-invoice-controller.js ~ line 128 ~ CreateInvoinceController ~ _onSave ~ result", result.data)
        // return result; 
    }
}

module.exports = CreateInvoinceController;