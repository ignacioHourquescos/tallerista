import { DATABASE } from '../../config';
import { firestore } from '../../firebase/firebase';
import { OrderDto } from '../models/order';

export const getOrdersByClient = async (client: any) => {
  const products = firestore
    .collection(DATABASE)
    .where('cliente', '==', client);

  const query = await products.get();
  const data = query.docs.map((doc: any) => ({ ...doc.data(), id: doc.id }));
  return data;
};

export const postOrder = async (orderData: OrderDto) => {
  console.log(
    'nombre de la base de coleccion a donde estamos enviando la orden',
    DATABASE
  );
  console.log(
    'Datos completos de la orden:',
    JSON.stringify(orderData, null, 2)
  );

  try {
    // Validar que orderData no tenga campos undefined
    const hasUndefinedFields = Object.entries(orderData).some(
      ([key, value]) => {
        if (value === undefined) {
          console.error(`Campo undefined encontrado: ${key}`);
          return true;
        }
        return false;
      }
    );

    if (hasUndefinedFields) {
      throw new Error('orderData contiene campos undefined');
    }

    const ordersRef = firestore.collection(DATABASE);
    const result = await ordersRef.add(orderData);
    console.log('Order posted successfully with ID:', result.id);
    localStorage.removeItem('cartItems');
    return 'Order posted successfully';
  } catch (error) {
    // Handle any errors that might occur during the process
    console.error('Error posting order:', error);
    console.error(
      'Order data that failed:',
      JSON.stringify(orderData, null, 2)
    );
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to post order to Firebase: ${errorMessage}`);
  }
};

export const getOrderById = async (documentId: string) => {
  try {
    const orderRef = firestore.collection(DATABASE).doc(documentId);
    const orderDoc = await orderRef.get();

    if (orderDoc.exists) {
      const orderData = orderDoc.data() as OrderDto;
      return { ...orderData, id: orderDoc.id };
    } else {
      throw new Error('Order not found');
    }
  } catch (error) {
    console.error('Error fetching order:', error);
    throw new Error('Failed to fetch order from Firebase');
  }
};

export const getLastOrderFromClient = async (client: OrderDto) => {
  console.log('Entering getLastOrderFromClient function with client:', client);
  if (!client) {
    console.error('No client provided');
    return Promise.reject('No client provided');
  }

  try {
    const products = firestore
      .collection(DATABASE)
      .where('cliente', '==', client)
      .orderBy('timestamp', 'asc');

    const query = await products.get();
    console.log('Firestore query executed, query size:', query.size);

    if (query.empty) {
      console.log('No records found for client:', client);
      return null;
      return Promise.reject('No records found');
    }

    const data = query.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    console.log('Data retrieved for client:', client, data);

    return data.reverse()[0]; // Assuming you want the last order
  } catch (error) {
    console.error(
      'Error fetching data from Firestore for client:',
      client,
      error
    );
    throw error;
  }
};

export const addItemToExistingOrder = (
  slug: string,
  selectedClient: string,
  dataSource: any[], // You can specify the type of dataSource
  logisticaObs: string,
  clienteObs: 'Pedido Modificado'
) => {
  return new Promise((resolve, reject) => {
    const documentRef = firestore.collection(DATABASE).doc(String(slug));

    documentRef
      .get()
      .then((existingData) => {
        if (!existingData.exists) {
          reject(new Error('Document does not exist'));
        } else {
          console.log('DOCUMENT REF', documentRef);
          documentRef
            .update({
              cliente: selectedClient,
              order: dataSource,
              clienteObs: clienteObs,
              logisticaObs: logisticaObs,
            })
            .then(() => {
              resolve({ success: true });
            })
            .catch((error) => {
              reject(error);
            });
        }
      })
      .catch((error) => {
        console.error('Error getting document:', error);
        reject(error);
      });
  });
};
