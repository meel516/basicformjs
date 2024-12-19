export const formSchema = {
    groups: {
        basic: {
            required: true,
            fields: {
                name: {
                    type: 'text',
                    required: true,
                    validate: value => value.trim() !== ''
                },
                email: {
                    type: 'email',
                    required: true,
                    validate: value => {
                      
                        return true
                    }
                }
            }
        },
        address: {
            required: false,
            conditional: true,
            fields: {
                street: {
                    type: 'text',
                    required: true,
                    validate: value => value.trim() !== ''
                },
                city: {
                    type: 'text',
                    required: true,
                    validate: value => value.trim() !== ''
                },
                zipcode: {
                    type: 'text',
                    // required: true,
                    validate: value => value.trim() !== ''
                },
              cars:{
                required:true,
                validate:value=>value !==""
              }
            }
        }
      ,payment:{
          required: false,
          conditional: true,
        fields:{
          amount:{
            type:"number",
            required:true,
            validate:value=>value>0&&value<100
          }
        }
      }
    }
};